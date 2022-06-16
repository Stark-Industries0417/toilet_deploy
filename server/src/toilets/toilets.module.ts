import { Module } from '@nestjs/common';
import { ToiletsController } from './controllers/toilets.controller';
import { ToiletsService } from './services/toilets.service';

@Module({
  controllers: [ToiletsController],
  providers: [ToiletsService],
})
export class ToiletsModule {}
