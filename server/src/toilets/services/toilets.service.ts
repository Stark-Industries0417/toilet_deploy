import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewEntity } from 'src/reviews/reviews.entity';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ToiletAddDto } from '../dtos/toilet.add.dto';
import { ToiletAroundDto } from '../dtos/toilet.around.dto';
import { ToiletReportDto } from '../dtos/toilet.report.dto';
import { ToiletEntity } from '../toilets.entity';

@Injectable()
export class ToiletsService {
  constructor(
    @InjectRepository(ToiletEntity)
    private readonly toiletsRepository: Repository<ToiletEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewsRepository: Repository<ReviewEntity>,
  ) {}

  async aroundToilet(userLocation: ToiletAroundDto) {
    const { lat, lng, dist } = userLocation;
    try {
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
          ) AS distance,
          o.*
          FROM toilet.TOILET as t
          LEFT OUTER JOIN toilet.OPTION as o
          ON t.option_id = o.id
          HAVING distance < ${dist}
          ORDER BY distance
          LIMIT 0, 20;`);

      return toilets;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async toiletAdditional(
    userInfo: UserEntity,
    toiletAddDto: ToiletAddDto,
  ): Promise<ToiletEntity> {
    const { address, detailAddress, lat, lng, category, subway } = toiletAddDto;
    console.log(toiletAddDto);
    const toilet = new ToiletEntity();
    toilet.address = address;
    toilet.detailAddress = detailAddress;
    toilet.lat = lat;
    toilet.lng = lng;
    toilet.category = category;
    toilet.subway = subway;

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

  async getOneToilet(toiletReportDto: ToiletReportDto): Promise<ToiletEntity> {
    try {
      const toilet = await this.toiletsRepository.findOne(toiletReportDto, {
        relations: ['option'],
      });
      return toilet;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async toiletReport(toiletReportDto: ToiletReportDto) {
    try {
      const toilet = await this.toiletsRepository.findOne(toiletReportDto);
      toilet.stack++;

      if (toilet.stack === 3) {
        return await this.toiletsRepository.remove(toilet);
      } else {
        return await this.toiletsRepository.save(toilet);
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
