import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsDate, IsString, IsUUID } from 'class-validator';
import { ReviewEntity } from '../reviews.entity';

export class ToiletsReivew extends PickType(ReviewEntity, ['rate', 'content']) {
  @ApiProperty({
    example: 'c33c7d1b-fbef-48f9-9ca1-20384f6b1560',
    description: 'review의 id 입니다',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'stark',
    description: 'nickname',
  })
  @IsString()
  nickname: string;

  @ApiProperty({
    example:
      'https://toiletprofile.s3.ap-northeast-2.amazonaws.com/Profile-Image.svg',
    description: 'user image url',
  })
  @IsString()
  imgUrl: string;

  @ApiProperty({
    example: '2022/07/05',
    description: '리뷰 작성 날짜',
  })
  @IsDate()
  time: Date;
}
