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

  async toiletsLocation(location) {}
}
