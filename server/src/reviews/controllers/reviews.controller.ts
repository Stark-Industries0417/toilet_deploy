import { Body } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AwsService } from 'src/aws.service';
import { User } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserEntity } from 'src/users/users.entity';
import { ReviewsService } from '../services/reviews.service';

@UseInterceptors(SuccessInterceptor)
@Controller('api/reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly awsService: AwsService,
  ) {}

  @ApiOperation({
    summary: '리뷰 추가 페이지',
  })
  @ApiResponse({
    status: 201,
    description: 'success: true, 리뷰 정보 반환',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('additional')
  async reviewAdditional(@User() user: UserEntity, @Body() reviewAddDto) {
    return await this.reviewsService.additional(user.id, reviewAddDto);
  }
}
