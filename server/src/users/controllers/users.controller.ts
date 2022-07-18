import { Body, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Post, Patch } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AwsService } from 'src/aws.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { MailService } from 'src/mail/mail.service';
import { UserEmailDto } from '../dtos/user.email.dto';
import { UserLoginDto } from '../dtos/user.login.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { UsersService } from '../services/users.service';

import { User } from '../../common/decorators/user.decorator';
import { UserEntity } from '../users.entity';
import { UserEditNicknameInputDto } from '../dtos/user.modify.nickname.dto';
import { UserModifyPasswordDto } from '../dtos/user.modifyPassword.dto';

@Controller('api/users')
@ApiTags('USER')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  email: UserEmailDto;
  userImg: string;
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly awsService: AwsService,
    private readonly mailService: MailService,
  ) {
    this.userImg =
      'https://toiletprofile.s3.ap-northeast-2.amazonaws.com/Profile-Image.svg';
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
  signUp(@Body() userRegisterDto: UserRegisterDto): Promise<UserResponseDto> {
    return this.usersService.signUp(userRegisterDto, this.userImg);
  }

  @ApiResponse({
    status: 200,
    description: '성공 시 success true 반환',
  })
  @ApiResponse({
    status: 409,
    description: '실패 시 409 충돌',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: '이메일 유효성 검사' })
  @Post('check_email')
  async checkEmail(@Body() userEmailDto: UserEmailDto) {
    return await this.usersService.checkEmail(userEmailDto);
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
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@Req() req: Request) {
    return req.user;
  }

  @ApiResponse({
    status: 200,
    description: '유저 프로필 이미지 url 반환',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '유저 이미지 업로드' })
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload')
  async uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const { key } = await this.awsService.uploadFileToS3('users', file);
      this.userImg = this.awsService.getAwsS3FileUrl(key);
    } else {
      this.userImg =
        'https://toiletprofile.s3.ap-northeast-2.amazonaws.com/Profile-Image.svg';
    }
  }

  @ApiResponse({
    status: 200,
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '유저 이미지 수정 api' })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Patch('modify_image')
  async modifyUserImg(@User() userInfo: UserEntity): Promise<UserResponseDto> {
    return await this.usersService.modifyUserImg(userInfo, this.userImg);
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
    description: '기존 비밀번호와 같습니다.',
  })
  @ApiResponse({
    status: 201,
    description: '비밀번호 수정 성공',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary:
      '1. redirect API로 먼저 이메일 보내야 합니다. 2.이메일로 받은 링크로 접속한 페이지의 API',
  })
  @Patch('reset_password')
  async resetPassword(@Body() userModifyPasswordDto: UserModifyPasswordDto) {
    return await this.usersService.modifyPassword(
      userModifyPasswordDto,
      this.email,
    );
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('modify_nickname')
  @ApiOperation({ summary: '닉네임 수정' })
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

  @ApiResponse({
    status: 200,
    description: '기존 비밀번호와 같습니다.',
  })
  @ApiResponse({
    status: 201,
    description: '비밀번호 수정 성공',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: '의도적으로 비밀번호 재설정' })
  @Patch('modify_password')
  async modifyPassword(
    @User() user: UserEntity,
    @Body() userModifyPasswordDto: UserModifyPasswordDto,
  ) {
    return await this.usersService.modifyPassword(
      userModifyPasswordDto,
      this.email,
      user,
    );
  }

  @ApiResponse({
    status: 200,
    description: '회원 탈퇴 성공',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: '회원 탈퇴 API' })
  @Delete('withdrawal')
  async userWithdrawal(@User() userInfo: UserEntity) {
    return await this.usersService.userWithdrawal(userInfo);
  }
}
