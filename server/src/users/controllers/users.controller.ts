import { Body, Get, Req, UseGuards } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Post, Patch } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AwsService } from 'src/aws.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { MailService } from 'src/mail/mail.service';
import { UserEmailDto } from '../dtos/user.email.dto';
import { UserLoginDto } from '../dtos/user.login.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserResetPasswordDto } from '../dtos/user.resetPassword.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { UsersService } from '../services/users.service';
import { UserEditNicknameInputDto } from '../dtos/user.edit.nickname.dto';
import { User } from '../../common/decorators/user.decorator';
import { UserEntity } from '../users.entity';

@Controller('api/users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  email: UserEmailDto;
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly awsService: AwsService,
    private readonly mailService: MailService,
  ) {
    this.email = { email: '' };
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: UserResponseDto,
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '회원가입' })
  @Post('register')
  signUp(@Body() userRegisterDto: UserRegisterDto) {
    return this.usersService.signUp(userRegisterDto);
  }

  @ApiResponse({
    status: 200,
    description: 'JWT 토큰 발급',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: UserLoginDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiResponse({
    status: 200,
    description: '현재 유저 정보',
    type: UserResponseDto,
  })
  @ApiOperation({ summary: '현재 유저 정보' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@Req() req: Request) {
    return req.user;
  }

  @ApiResponse({
    status: 200,
    description: '유저 프로필 이미지 url 반환',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiConsumes('application/json')
  @ApiOperation({ summary: '유저 이미지 업로드' })
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload')
  async uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    const { key } = await this.awsService.uploadFileToS3('users', file);
    return this.usersService.saveImg(key);
  }

  @ApiResponse({
    status: 200,
    description:
      '비밀번호 재설정 페이지 url: http://localhost:3000/find_password 반환 (임시)',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiConsumes('application/json')
  @ApiOperation({
    summary: 'request 이메일이 회원가입 되있는 이메일 이어야 합니다.',
  })
  @Post('redirect')
  sendMail(@Body() email: UserEmailDto) {
    this.email = email;
    return this.mailService.sendMail(email);
  }

  @ApiResponse({
    status: 200,
    description: 'success: true 반환',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: '이메일로 받은 링크로 접속한 페이지의 API' })
  @Patch('reset_password')
  async resetPassword(@Body() passwords: UserResetPasswordDto) {
    return await this.usersService.resetPassword(this.email, passwords);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('modify_nickname')
  @ApiConsumes('application/x-www-form-urlencoded')
  async modifyNickname(
    @User() user: UserEntity,
    @Body() userEditNicknameInputDto: UserEditNicknameInputDto,
  ) {
    return await this.usersService.modifyNickname(
      user,
      userEditNicknameInputDto,
    );
  }
}
