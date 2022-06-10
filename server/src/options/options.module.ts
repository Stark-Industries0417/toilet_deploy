import { Module } from '@nestjs/common';
import { OptionsController } from './controllers/options.controller';
import { OptionsService } from './services/options.service';

@Module({
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
