import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ToiletAddDto } from '../dtos/toilet.add.dto';
import { ToiletAroundDto } from '../dtos/toilet.around.dto';
import { ToiletEntity } from '../toilets.entity';

@Injectable()
export class ToiletsService {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly toiletsRepository: Repository<ToiletEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async aroundToilet(userLocation: ToiletAroundDto) {
    const { lat, lng, dist } = userLocation;
    const toilets = await this.toiletsRepository.query(`
        SELECT
          t.*, (
          6371 * acos (
          cos ( radians(${lat}) )
          * cos( radians( t.lat ) )
          * cos( radians( t.lng ) - radians(${lng}) )
          + sin ( radians(${lat}) )
          * sin( radians( t.lat ) )
        )
        ) AS distance, o.*
        FROM toilet.TOILET as t, toilet.OPTION as o
        WHERE t.option_id = o.id
        HAVING distance < ${dist}
        ORDER BY distance
        LIMIT 0 , 20;`);

    return toilets;
  }

  async toiletAdditional(userInfo: UserEntity, toiletAddDto: ToiletAddDto) {
    const { address, detailAddress, lat, lng, category } = toiletAddDto;
    const toilet = new ToiletEntity();
    toilet.address = address;
    toilet.detailAddress = detailAddress;
    toilet.lat = lat;
    toilet.lng = lng;
    toilet.category = category;

    try {
      const author = await this.usersRepository.findOne({
        where: { id: userInfo.id },
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
