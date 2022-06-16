import { PickType } from '@nestjs/swagger';
import { ToiletEntity } from '../toilets.entity';

export class ToiletAddDto extends PickType(ToiletEntity, [
  'address',
  'detailAddress',
  'category',
  'lat',
  'lng',
]) {}
