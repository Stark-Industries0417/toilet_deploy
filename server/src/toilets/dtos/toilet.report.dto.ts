import { PickType } from '@nestjs/swagger';
import { ToiletEntity } from '../toilets.entity';

export class ToiletReportDto extends PickType(ToiletEntity, ['address']) {}
