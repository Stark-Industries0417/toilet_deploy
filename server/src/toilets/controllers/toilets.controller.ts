import { Body } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserEntity } from 'src/users/users.entity';
import { ToiletAddDto } from '../dtos/toilet.add.dto';
import { ToiletsService } from '../services/toilets.service';

@UseInterceptors(SuccessInterceptor)
@Controller('api/toilets')
export class ToiletsController {
  constructor(private readonly toiletsService: ToiletsService) {}

  @ApiOperation({
    summary: '내 주변 화장실 정보',
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiResponse({
    status: 200,
    description: '2km 이내 화장실들의 정보들 반환',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Post('around_toilet')
  async aroundToilet(@Body() userLocation) {
    return this.toiletsService.aroundToilet(userInfo, userLocation);
  }

  @ApiResponse({
    status: 201,
    description: 'success: true, 화장실 정보 반환',
    type: ToiletAddDto,
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: '화장실 추가 API',
  })
  @UseGuards(JwtAuthGuard)
  @Post('additional')
  async toiletAdditional(
    @User() userInfo: UserEntity,
    @Body() toiletAddDto: ToiletAddDto,
  ) {
    return await this.toiletsService.toiletAdditional(userInfo, toiletAddDto);
  }
}
