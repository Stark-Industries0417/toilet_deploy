import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { OptionEntity } from 'src/options/options.entity';
import { ReviewEntity } from 'src/reviews/reviews.entity';
import { UserEntity } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity({
  name: 'TOILET',
})
export class ToiletEntity extends CommonEntity {
  @ApiProperty({
    example: '서울시 강남구 역삼동 2-16',
    description: '화장실 주소',
    required: true,
  })
  @IsString()
  @Column({ type: 'varchar', unique: true, nullable: false })
  address: string;

  @ApiProperty({
    example: '41.40338',
    description: '화장실 위도',
    required: true,
  })
  @IsNumber()
  @Column({ type: 'double', nullable: false })
  lat: number;

  @ApiProperty({
    example: '2.17403',
    description: '화장실 경도',
    required: true,
  })
  @Column({ type: 'double', nullable: false })
  lng: number;

  @ApiProperty({
    example: 'https://toiletImg.s3~~~~~.com',
    description: '화장실 이미지',
    required: false,
  })
  @IsString()
  @Column({ type: 'string', nullable: false })
  toiletImg: string[];

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.toilets)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: UserEntity;

  @OneToMany(() => ReviewEntity, (review: ReviewEntity) => review.toilet, {
    cascade: true,
  })
  reviews: ReviewEntity[];

  @OneToOne(() => OptionEntity, {
    cascade: true,
  })
  @JoinColumn()
  option: OptionEntity;
}
