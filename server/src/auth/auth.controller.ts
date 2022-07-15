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
  constructor(private readonly authService: AuthService) {}

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
    summary: '카카오 로그인한 사용자의 정보 반환하는 api',
  })
  @ApiResponse({
    status: 200,
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: '이미 이메일로 가입한 경우 ConflictException 에러를 띄웁니다.',
  })
  @UseGuards(KakaoAuthGuard)
  @Get('/kakao/redirect')
  async kakaoLoginCallback(
    @User() kakao: KakaoRegisterDto,
    @Res() res: Response,
  ) {
    const user = await this.authService.kakaoLogin(kakao);
    return res.status(200).send({ user });
  }
}
