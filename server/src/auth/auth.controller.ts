import {
  Controller,
  Get,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserResponseDto } from 'src/users/dtos/user.response.dto';
import { AuthService } from './auth.service';
import { KakaoAuthGuard } from './jwt/kakao.guard';
import { KakaoRegisterDto } from './kakao.register.dto';
import { Response } from 'express';

@ApiTags('kakao')
@UseInterceptors(SuccessInterceptor)
@Controller('api/auth')
export class AuthController {
  kakaoUser: UserResponseDto;
  constructor(private readonly authService: AuthService) {
    this.kakaoUser = null;
  }

  @ApiOperation({
    summary: '/api/kakao/redirect로 리다이렉트 되는 api 입니다.',
    description: '이 api로 카카오 로그인 버튼 연결해 주시면 됩니다.',
  })
  @ApiResponse({
    status: 200,
  })
  @UseGuards(KakaoAuthGuard)
  @Get('/kakao')
  kakaoLogin() {
    return;
  }

  @ApiOperation({
    summary: '리다이렉트 API',
  })
  @ApiResponse({
    status: 302,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('/kakao/redirect')
  async kakaoLoginCallback(
    @User() kakao: KakaoRegisterDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.kakaoLogin(kakao);
    this.kakaoUser = user;
    res.redirect('http://localhost:3000/auth/sns');
    res.end();
  }

  @ApiOperation({
    summary: '프런트에게 카카오 사용자 정보 전달 API',
  })
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('/kakao/user')
  kakaoUserInfo(): UserResponseDto {
    return this.kakaoUser;
  }
}
