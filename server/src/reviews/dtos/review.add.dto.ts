import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { OptionEntity } from 'src/options/options.entity';
import { Column } from 'typeorm';

export class ReviewAddDto extends PickType(OptionEntity, [
  'common',
  'lock',
  'types',
  'paper',
  'disabled',
]) {
  @ApiProperty({
    example: '서울시 강남구 역삼동 2-16',
    description: '화장실 주소',
    required: true,
  })
  @IsString()
  @Column({ type: 'varchar', unique: true, nullable: false })
  address: string;

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
  @IsInt()
  @Type(() => Number)
  @Column({ type: 'int', nullable: false })
  rate: number;
}
