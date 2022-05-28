import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEntity } from '../users.entity';

export class UserRegisterDto extends PickType(UserEntity, [
  'email',
  'password',
  'nickname',
] as const) {
  @IsString()
  @ApiProperty({
    example: 'stark123!',
    description: 'check password',
  })
  checkPassword: string;
}
