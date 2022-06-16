import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ToiletAddDto } from '../dtos/toilet.add.dto';
import { ToiletEntity } from '../toilets.entity';

@Injectable()
export class ToiletsService {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly toiletsRepository: Repository<ToiletEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async aroundToilet(userLocation) {
    const { lat, lng } = userLocation;
    const toilets = await this.toiletsRepository.query(`
        SELECT
          *, (
          6371 * acos (
          cos ( radians(${lat}) )
          * cos( radians( lat ) )
          * cos( radians( lng ) - radians(${lng}) )
          + sin ( radians(${lat}) )
          * sin( radians( lat ) )
        )
        ) AS distance
        FROM TOILET
        HAVING distance < 2
        ORDER BY distance
        LIMIT 0 , 20;`);

    return toilets;
  }

  async toiletAdditional({ id }, toiletAddDto: ToiletAddDto) {
    const { address, detailAddress, lat, lng, category } = toiletAddDto;
    const toilet = new ToiletEntity();
    toilet.address = address;
    toilet.detailAddress = detailAddress;
    toilet.lat = lat;
    toilet.lng = lng;
    toilet.category = category;

    try {
      const author = await this.usersRepository.findOne({
        where: { id },
        relations: ['toilets'],
      });
      author.toilets.push(toilet);
      await this.usersRepository.save(author);
      return toilet;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
