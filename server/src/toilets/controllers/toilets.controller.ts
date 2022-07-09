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
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserEntity } from 'src/users/users.entity';
import { ToiletAddDto } from '../dtos/toilet.add.dto';
import { ToiletAroundDto } from '../dtos/toilet.around.dto';
import { ToiletReportDto } from '../dtos/toilet.report.dto';
import { ToiletsService } from '../services/toilets.service';
import { ToiletEntity } from '../toilets.entity';

@UseInterceptors(SuccessInterceptor)
@Controller('api/toilets')
@ApiTags('TOILET')
export class ToiletsController {
  constructor(private readonly toiletsService: ToiletsService) {}

  @ApiOperation({
    summary: '해당 주소의 화장실 정보 읽기 API',
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: ToiletEntity,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Post()
  async getOneToilet(
    @Body() toiletReportDto: ToiletReportDto,
  ): Promise<ToiletEntity> {
    return await this.toiletsService.getOneToilet(toiletReportDto);
  }

  @ApiOperation({
    summary:
      '내 주변 화장실 정보와 옵션 정보 API, 테스트 하실 때 화장실 먼저 추가하셔야 합니다',
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiResponse({
    status: 200,
    description: '요청해준 km 이내 화장실들의 정보들 반환',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @UseGuards(JwtAuthGuard)
  @Post('around_toilet')
  async aroundToilet(@Body() userLocation: ToiletAroundDto) {
    return this.toiletsService.aroundToilet(userLocation);
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
  ): Promise<ToiletEntity> {
    return await this.toiletsService.toiletAdditional(userInfo, toiletAddDto);
  }

  @ApiResponse({
    status: 200,
    description: 'success true 반환',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiOperation({
    summary: '화장실 신고 API',
  })
  @UseGuards(JwtAuthGuard)
  @Post('report')
  async toiletReport(@Body() toiletReportDto: ToiletReportDto) {
    return await this.toiletsService.toiletReport(toiletReportDto);
  }
}
