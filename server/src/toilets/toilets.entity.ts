import { CommonEntity } from 'src/common/entities/common.entity';
import { ReviewEntity } from 'src/reviews/reviews.entity';
import { UserEntity } from 'src/users/users.entity';
import { Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

export class ToiletEntity extends CommonEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  address: string;

  @Column({ type: 'double', nullable: false })
  lat: number;

  @Column({ type: 'double', nullable: false })
  lng: number;

  @Column({ type: 'string', nullable: false })
  toiletImg: string;

  @Column({ type: 'boolean', nullable: false })
  subway: boolean;

  @ManyToOne(() => UserEntity, (author: UserEntity) => author.toilets)
  @JoinColumn({ name: 'author_id', referencedColumnName: 'id' })
  author: UserEntity;

  @OneToMany(() => ReviewEntity, (review: ReviewEntity) => review.toilet)
  reviews: ReviewEntity[];
}
