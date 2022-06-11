import { ApiProperty } from '@nestjs/swagger';
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
  @Column({ type: 'text', nullable: false })
  content: string;

  @ApiProperty({
    description: '별점',
    required: true,
  })
  @Column({ type: 'number', nullable: false })
  rate: number;

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.reviews)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: UserEntity;

  @ManyToOne(() => ToiletEntity, (toilet: ToiletEntity) => toilet.reviews)
  @JoinColumn({ name: 'toilet_id', referencedColumnName: 'id' })
  toilet: ToiletEntity;

  @OneToOne(() => OptionEntity)
  @JoinColumn()
  option: OptionEntity;
}
