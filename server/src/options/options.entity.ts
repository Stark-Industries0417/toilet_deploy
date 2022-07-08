import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean } from 'class-validator';
import { CommonEntity } from 'src/common/entities/common.entity';
import { ReviewEntity } from 'src/reviews/reviews.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity({
  name: 'OPTION',
})
export class OptionEntity extends CommonEntity {
  @ApiProperty({
    example: true,
    description: '남녀 공용 여부 default 값: false',
    default: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  common: boolean;

  @ApiProperty({
    example: true,
    description: '자물쇠(비밀번호) 여부',
    default: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  lock: boolean;

  @ApiProperty({
    example: 0,
    description: '양변기: 0, 좌변기: 1, 비데: 2',
  })
  @Type(() => Array)
  @IsArray()
  @Column('simple-array', { nullable: true })
  types: number[];

  @ApiProperty({
    example: true,
    description: '휴지 있으면 true, 없으면 false',
    default: true,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: true })
  paper: boolean;

  @ApiProperty({
    example: true,
    description: '장애인 화장실 여부',
    default: false,
  })
  @Type(() => Boolean)
  @IsBoolean()
  @Column({ type: 'boolean', nullable: false, default: false })
  disabled: boolean;

  @OneToOne(() => ReviewEntity, {
    cascade: true,
  })
  review: ReviewEntity;
}
