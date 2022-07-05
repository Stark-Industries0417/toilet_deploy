import { PickType } from '@nestjs/swagger';
import { ToiletEntity } from '../toilets.entity';

export class ToiletAddDto extends PickType(ToiletEntity, [
  'address',
  'detailAddress',
  'subway',
  'category',
  'lat',
  'lng',
]) {}
