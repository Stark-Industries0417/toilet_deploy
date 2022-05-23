import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';

export class UserRegisterDto extends PickType(UserEntity, [
  'email',
  'password',
  'nickname',
] as const) {
  @ApiProperty({
    example: 'stark123!',
    description: 'check password',
  })
  checkPassword: string;
}
