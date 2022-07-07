import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, IsUUID } from 'class-validator';
import { OptionEntity } from 'src/options/options.entity';

export class ReviewModifyDto extends PickType(OptionEntity, [
  'common',
  'lock',
  'types',
  'paper',
  'disabled',
]) {
  @ApiProperty({
    example: 'c33c7d1b-fbef-48f9-9ca1-20384f6b1560',
    description: 'review의 id 입니다',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: '리뷰 글',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: '별점',
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  rate: number;
}
