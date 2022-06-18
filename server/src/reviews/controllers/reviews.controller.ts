import { Body } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AwsService } from 'src/aws.service';
import { User } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { UserEntity } from 'src/users/users.entity';
import { ReviewAddDto } from '../dtos/review.add.dto';
import { ReviewsService } from '../services/reviews.service';

@UseInterceptors(SuccessInterceptor)
@Controller('api/reviews')
export class ReviewsController {
  toiletImgUrl;
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly awsService: AwsService,
  ) {
    this.toiletImgUrl = null;
  }

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
  async reviewAdditional(
    @User() userInfo: UserEntity,
    @Body() reviewAddDto: ReviewAddDto,
  ) {
    return await this.reviewsService.additional(
      userInfo,
      reviewAddDto,
      this.toiletImgUrl,
    );
  }

  @ApiOperation({
    summary: '화장실 사진 업로드 API',
    description: '사진 1장만 업로드 가능합니다',
  })
  @ApiResponse({
    status: 201,
    description: 'success: true 반환',
  })
  @ApiConsumes('multipart/form-data')
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
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('upload')
  async uploadToiletImg(@UploadedFile() file: Express.Multer.File) {
    const { key } = await this.awsService.uploadFileToS3('toilets', file);
    const toiletImgUrl = this.awsService.getAwsS3FileUrl(key);
    this.toiletImgUrl = toiletImgUrl;
  }
}
