import { Body } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { UseFilters } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { AwsService } from 'src/aws.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserLoginDto } from '../dtos/user.login.dto';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { UsersService } from '../services/users.service';

@Controller('api/users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly awsService: AwsService,
  ) {}

  @ApiResponse({
    status: 500,
    description: 'Server Error',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: UserResponseDto,
  })
  @ApiConsumes('application/json')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: '회원가입' })
  @Post('register')
  signUp(@Body() userRegisterDto: UserRegisterDto) {
    return this.usersService.signUp(userRegisterDto);
  }

  @ApiConsumes('application/json')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: UserLoginDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '유저 이미지 업로드' })
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload')
  async uploadUserImg(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.awsService.uploadFileToS3('users', file);
  }

  @ApiOperation({ summary: '유저 이미지 가져오기' })
  @Post('image')
  getImageUrl(@Body('key') key: string) {
    return this.awsService.getAwsS3FileUrl(key);
  }
}
