import { Body, Get, Req, UseGuards } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UseFilters } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
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

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: UserLoginDto) {
    return this.authService.jwtLogIn(data);
  }

  @ApiOperation({ summary: '현재 유저 정보' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentUser(@Req() req: Request) {
    return req.user;
  }
}
