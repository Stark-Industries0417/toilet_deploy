import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ToiletEntity } from '../toilets.entity';

@Injectable()
export class ToiletsService {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly toiletsRepository: Repository<ToiletEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async toiletAdditional({ id }, toiletAddDto) {
    const { address, lat, lng } = toiletAddDto;
    const author = await this.usersRepository.findOne({
      where: { id },
      relations: ['toilets'],
    });
    const toilet = new ToiletEntity();
    toilet.address = address;
    toilet.lat = lat;
    toilet.lng = lng;

    author.toilets.push(toilet);

    return await this.usersRepository.save(author);
  }

  async toiletsLocation(location) {}
}
