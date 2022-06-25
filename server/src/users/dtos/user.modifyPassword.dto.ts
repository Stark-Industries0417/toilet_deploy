import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserRegisterDto } from './user.register.dto';

export class UserModifyPasswordDto extends PickType(UserRegisterDto, [
  'password',
  'checkPassword',
]) {
  @ApiProperty({
    example: 'stark',
    description: '기존 비밀번호',
    nullable: true,
  })
  @IsOptional()
  existPassword?: string;
}
