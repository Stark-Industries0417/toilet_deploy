import { ApiProperty } from '@nestjs/swagger';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'OPTION',
})
export class OptionEntity extends CommonEntity {
  @ApiProperty({
    example: true,
    description: '남녀 공용 여부 default 값: false',
    default: false,
  })
  @Column({ type: 'boolean', nullable: false, default: false })
  common: boolean;

  @ApiProperty({
    example: true,
    description: '자물쇠(비밀번호) 여부',
    default: false,
  })
  @Column({ type: 'boolean', nullable: false, default: false })
  lock: boolean;

  @ApiProperty({
    example: 0,
    description: '양변기: 0, 좌변기: 1, 비데: 2',
    default: 0,
  })
  @Column({ type: 'enum', enum: [0, 1, 2], nullable: false, default: 0 })
  types: number;

  @ApiProperty({
    example: true,
    description: '휴지 있으면 true, 없으면 false',
    default: true,
  })
  @Column({ type: 'boolean', nullable: false, default: true })
  paper: boolean;

  @ApiProperty({
    example: true,
    description: '자판기 여부',
    default: false,
  })
  @Column({ type: 'boolean', nullable: false, default: false })
  vending: boolean;
}
