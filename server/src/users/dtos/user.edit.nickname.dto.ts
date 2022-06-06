import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserEditNicknameInputDto {
  @ApiProperty({
    description: 'new nickname',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: '새로운 닉네임을 작성해주세요.' })
  nickname: string;
}
