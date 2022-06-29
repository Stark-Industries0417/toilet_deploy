import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsService } from 'src/aws.service';
import { OptionsModule } from 'src/options/options.module';
import { ToiletsModule } from 'src/toilets/toilets.module';
import { UsersModule } from 'src/users/users.module';
import { ReviewsController } from './controllers/reviews.controller';
import { ReviewEntity } from './reviews.entity';
import { ReviewsService } from './services/reviews.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity]),
    UsersModule,
    forwardRef(() => ToiletsModule),
    OptionsModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, AwsService],
  exports: [TypeOrmModule],
})
export class ReviewsModule {}
