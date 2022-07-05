import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionEntity } from 'src/options/options.entity';
import { ToiletReportDto } from 'src/toilets/dtos/toilet.report.dto';
import { ToiletEntity } from 'src/toilets/toilets.entity';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ReviewAddDto } from '../dtos/review.add.dto';
import { ToiletsReivew } from '../dtos/review.toilet.dto';
import { ReviewEntity } from '../reviews.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewsRepository: Repository<ReviewEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ToiletEntity)
    private readonly toiletsRepository: Repository<ToiletEntity>,
    @InjectRepository(OptionEntity)
    private readonly optionReposotiry: Repository<OptionEntity>,
  ) {}

  async additional(
    userInfo: UserEntity,
    reviewAddDto: ReviewAddDto,
    toiletImgUrl: string,
  ) {
    const { address, common, lock, types, paper, disabled, rate, content } =
      reviewAddDto;

    try {
      const option = await this.optionReposotiry.save({
        common,
        lock,
        types,
        paper,
        disabled,
      });
      const review = new ReviewEntity();
      review.rate = rate;
      review.content = content;
      review.option = option;
      review.toiletImg = toiletImgUrl;

      const user = await this.usersRepository.findOne({
        where: { id: userInfo.id },
        relations: ['reviews'],
      });
      const toilet = await this.toiletsRepository.findOne({
        where: { address },
        relations: ['reviews', 'option'],
      });
      toilet.reviews.push(review);
      toilet.option = option;

      user.reviews.push(review);

      Promise.all([
        await this.usersRepository.save(user),
        await this.toiletsRepository.save(toilet),
      ]);
      return review;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUserReview(userInfo: UserEntity): Promise<ReviewEntity[]> {
    try {
      const reviews = await this.reviewsRepository.query(`
      SELECT review.id, toilet.address, rate, content, toilet_img,
      DATE_FORMAT(CONVERT_TZ(review.created_at, 'UTC', 'Asia/Seoul'), '%Y/%m/%d') as time
      FROM toilet.REVIEW as review, toilet.TOILET as toilet
      WHERE review.author_id = '${userInfo.id}' and review.toilet_id = toilet.id
      ORDER BY review.created_at DESC
      `);

      return reviews;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getToiletReview({
    address,
  }: ToiletReportDto): Promise<ToiletsReivew[]> {
    try {
      const reviews = await this.reviewsRepository.query(`
        SELECT review.id, user.img_url, user.nickname, review.rate, 
        DATE_FORMAT(CONVERT_TZ(review.created_at, 'UTC', 'Asia/Seoul'), '%Y/%m/%d') as time,
        review.content
        FROM toilet.REVIEW as review, toilet.USER as user, toilet.TOILET as toilet
        WHERE review.toilet_id = toilet.id and review.author_id = user.id and toilet.address = '${address}'
        ORDER by review.created_at DESC;
      `);

      return reviews;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async reviewDelete(id: string) {
    try {
      const review = await this.reviewsRepository.findOne({
        where: { id },
        relations: ['option', 'toilet'],
      });

      const toilet = await this.toiletsRepository.findOne({
        where: { id: review.toilet.id },
      });

      await this.optionReposotiry.remove(review.option);

      const hasReview = await this.reviewsRepository.query(`
        SELECT *
        FROM toilet.REVIEW
        WHERE toilet_id = '${review.toilet.id}'
        ORDER BY created_at DESC
        LIMIT 1;
      `);

      if (hasReview[0]) {
        toilet.option = hasReview[0].option_id;
      } else {
        toilet.option = null;
      }
      return await this.toiletsRepository.save(toilet);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
