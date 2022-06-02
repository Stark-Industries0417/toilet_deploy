import { PickType } from '@nestjs/swagger';
import { UserRegisterDto } from './user.register.dto';

export class UserResetPasswordDto extends PickType(UserRegisterDto, [
  'password',
  'checkPassword',
]) {}
