import { Module } from '@nestjs/common';
import { ControllersController } from './controllers/reviews.controller';
import { ServicesService } from './services/services.service';

@Module({
  controllers: [ControllersController],
  providers: [ServicesService],
})
export class ReviewsModule {}
