import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { OptionEntity } from 'src/options/options.entity';
import { ToiletEntity } from 'src/toilets/toilets.entity';
import { UserEntity } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({
  name: 'REVIEW',
})
export class ReviewEntity extends CommonEntity {
  @ApiProperty({
    description: '리뷰 글',
    required: true,
  })
  @IsString()
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({
    description: '별점',
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  @Column({ type: 'int', nullable: false })
  rate: number;

  @ApiProperty({
    description: '화장실 이미지 주소',
  })
  @IsString()
  @Column({ type: 'varchar', nullable: true })
  toiletImg: string;

  @ApiProperty({
    example: 0,
    description: '리뷰 삭제 요청 받은 횟수',
    default: 0,
  })
  @Type(() => Number)
  @IsInt()
  @Column({ type: 'int', nullable: true, default: 0 })
  stack: number;

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.reviews)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: UserEntity;

  @ManyToOne(() => ToiletEntity, (toilet: ToiletEntity) => toilet.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'toilet_id', referencedColumnName: 'id' })
  toilet: ToiletEntity;

  @OneToOne(() => OptionEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  option: OptionEntity;
}
