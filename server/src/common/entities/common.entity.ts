import { IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class CommonEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
