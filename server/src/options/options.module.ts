import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionsController } from './controllers/options.controller';
import { OptionEntity } from './options.entity';
import { OptionsService } from './services/options.service';

@Module({
  imports: [TypeOrmModule.forFeature([OptionEntity])],
  controllers: [OptionsController],
  providers: [OptionsService],
  exports: [TypeOrmModule],
})
export class OptionsModule {}
