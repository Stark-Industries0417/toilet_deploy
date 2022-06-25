import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class ToiletAroundDto {
  @ApiProperty({
    example: 41.40338,
    description: '사용자 위도',
  })
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @ApiProperty({
    example: 2.17403,
    description: '사용자 경도',
  })
  @IsNumber()
  @Type(() => Number)
  lng: number;

  @ApiProperty({
    example: '2',
    description: '몇 Km 이내 화장실 가져올지',
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  dist: number;
}
