import { InternalServerErrorException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OptionEntity } from 'src/options/options.entity';
import { ToiletReportDto } from 'src/toilets/dtos/toilet.report.dto';
import { ToiletEntity } from 'src/toilets/toilets.entity';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { ReviewAddDto } from '../dtos/review.add.dto';
import { ReviewIdDto } from '../dtos/review.id.dto';
import { ReviewModifyDto } from '../dtos/review.modify.dto';
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
  ): Promise<ReviewEntity> {
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

      const setCleanAvg = await this.toiletsRepository.findOne({
        where: { address },
      });
      const reviews = await this.reviewsRepository.find({
        where: { toilet },
      });
      const cleanAvg = reviews.reduce((arr, cur, i, { length }) => {
        return i === length - 1 ? (arr + cur.rate) / length : arr + cur.rate;
      }, 0);

      setCleanAvg.clean = cleanAvg;
      await this.toiletsRepository.save(setCleanAvg);
      return review;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async getUserReview(userInfo: UserEntity): Promise<ReviewEntity[]> {
    try {
      const reviews = await this.reviewsRepository.query(`
      SELECT review.id as review_id, toilet.address, rate, content, toilet_img,
      DATE_FORMAT(CONVERT_TZ(review.created_at, 'UTC', 'Asia/Seoul'), '%Y/%m/%d') as review_time,
      o.id as option_id, o.common, o.lock, o.paper, o.disabled, o.types
      FROM toilet.REVIEW as review, toilet.TOILET as toilet, toilet.OPTION as o
      WHERE review.author_id = '${userInfo.id}' and review.toilet_id = toilet.id and review.option_id = o.id
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
        SELECT review.id as review_id, user.img_url as user_img, user.nickname, review.rate, review.toilet_img as toilet_img,
        DATE_FORMAT(CONVERT_TZ(review.created_at, 'UTC', 'Asia/Seoul'), '%Y/%m/%d') as time,
        review.content,
        o.id as option_id, o.common, o.lock, o.paper, o.disabled, o.types
        FROM toilet.REVIEW as review, toilet.USER as user, toilet.TOILET as toilet, toilet.OPTION as o
        WHERE review.toilet_id = toilet.id and review.author_id = user.id and toilet.address = '${address}'
        and review.option_id = o.id
        ORDER by review.created_at DESC;
      `);

      return reviews;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async photoDelete({ id }: ReviewIdDto): Promise<ReviewEntity> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
    });
    review.toiletImg = null;
    return await this.reviewsRepository.save(review);
  }

  async modifyReview(
    reviewModifyDto: ReviewModifyDto,
    toiletImgUrl: string,
  ): Promise<ReviewEntity> {
    try {
      const { id, content, rate, common, lock, types, paper, disabled } =
        reviewModifyDto;
      const option = await this.optionReposotiry.save({
        common,
        lock,
        types,
        paper,
        disabled,
      });
      const review = await this.reviewsRepository.findOne({
        where: { id },
        relations: ['toilet', 'option'],
      });
      if (toiletImgUrl && review.toiletImg !== toiletImgUrl) {
        review.toiletImg = toiletImgUrl;
      }
      review.content = content;
      review.rate = rate;
      review.option = option;
      await this.reviewsRepository.save(review);

      const toilet = await this.toiletsRepository.findOne({
        where: { id: review.toilet.id },
        relations: ['reviews', 'option'],
      });
      toilet.option = option;

      await this.toiletsRepository.save(toilet);

      return review;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async reportReview({ id }: ReviewIdDto): Promise<ReviewEntity> {
    try {
      const review = await this.reviewsRepository.findOne({
        where: { id },
        relations: ['toilet', 'option'],
      });
      review.stack++;

      if (review.stack === 3) {
        const toilet = await this.toiletsRepository.findOne({
          where: { id: review.toilet.id },
        });
        await this.optionReposotiry.remove(review.option);
        const [hasReview] = await this.reviewsRepository.query(`
        SELECT *
        FROM toilet.REVIEW
        WHERE toilet_id = '${review.toilet.id}'
        ORDER BY created_at DESC
        LIMIT 1;
      `);

        if (hasReview) {
          toilet.option = hasReview.option_id;
        } else {
          toilet.option = null;
        }
        await this.toiletsRepository.save(toilet);
        return review;
      } else {
        return await this.reviewsRepository.save(review);
      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async reviewDelete(reviewIdDto: string): Promise<ToiletEntity> {
    try {
      const review = await this.reviewsRepository.findOne({
        where: { id: reviewIdDto },
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
