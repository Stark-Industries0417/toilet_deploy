import { Module } from '@nestjs/common';
import { ControllersController } from './controllers/toilets.controller';
import { ServicesService } from './services/toilets.service';

@Module({
  controllers: [ControllersController],
  providers: [ServicesService],
})
export class ToiletsModule {}
