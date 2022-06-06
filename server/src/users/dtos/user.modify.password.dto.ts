import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserResetPasswordDto } from './user.resetPassword.dto';

export class UserModifyPasswordDto extends UserResetPasswordDto {
  @ApiProperty({
    example: 'stark',
    description: '기존 비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '기존 비밀번호를 입력해주세요' })
  existPassword: string;
}
