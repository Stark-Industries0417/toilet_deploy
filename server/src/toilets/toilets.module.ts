import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { UsersModule } from 'src/users/users.module';
import { ToiletsController } from './controllers/toilets.controller';
import { ToiletsService } from './services/toilets.service';
import { ToiletEntity } from './toilets.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ToiletEntity]),
    UsersModule,
    forwardRef(() => ReviewsModule),
  ],
  controllers: [ToiletsController],
  providers: [ToiletsService],
  exports: [TypeOrmModule],
})
export class ToiletsModule {}
