import { Get } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UseFilters } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserResponseDto } from '../dtos/user.response.dto';
import { UsersService } from '../services/users.service';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    status: 500,
    description: 'Server Error',
  })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
    type: UserResponseDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  signUp(@Body() userRegisterDto: UserRegisterDto) {
    return this.usersService.signUp(userRegisterDto);
  }
}
