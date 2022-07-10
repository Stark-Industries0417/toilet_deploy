import { Body, Delete, Get, Param, Patch } from '@nestjs/common';
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
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AwsService } from 'src/aws.service';
import { User } from 'src/common/decorators/user.decorator';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ToiletReportDto } from 'src/toilets/dtos/toilet.report.dto';
import { ToiletEntity } from 'src/toilets/toilets.entity';
import { UserEntity } from 'src/users/users.entity';
import { ReviewAddDto } from '../dtos/review.add.dto';
import { ReviewIdDto } from '../dtos/review.id.dto';
import { ReviewModifyDto } from '../dtos/review.modify.dto';
import { ToiletsReivew } from '../dtos/review.toilet.dto';
import { ReviewEntity } from '../reviews.entity';
import { ReviewsService } from '../services/reviews.service';

@UseInterceptors(SuccessInterceptor)
@Controller('api/reviews')
@ApiTags('REVIEW')
export class ReviewsController {
  toiletImgUrl: string;
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
  ): Promise<ReviewEntity> {
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
  @ApiConsumes('application/x-www-form-urlencoded')
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
    if (file) {
      const { key } = await this.awsService.uploadFileToS3('toilets', file);
      const toiletImgUrl = this.awsService.getAwsS3FileUrl(key);
      this.toiletImgUrl = toiletImgUrl;
    } else {
      this.toiletImgUrl = null;
    }
  }

  @ApiOperation({ summary: '리뷰 수정폼에서 사진 삭제 api' })
  @ApiResponse({
    status: 200,
    description: '리뷰 이미지 삭제 완료',
    type: ReviewEntity,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiBearerAuth('access-token')
  @ApiConsumes('application/x-www-form-urlencoded')
  @UseGuards(JwtAuthGuard)
  @Post('photo_delete')
  async photoDelete(@Body() reviewIdDto: ReviewIdDto): Promise<ReviewEntity> {
    return await this.reviewsService.photoDelete(reviewIdDto);
  }

  @ApiOperation({ summary: '사용자가 작성한 리뷰 get' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: [ReviewEntity],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get()
  async getUserReview(@User() userInfo: UserEntity): Promise<ReviewEntity[]> {
    return await this.reviewsService.getUserReview(userInfo);
  }

  @ApiOperation({ summary: '화장실 별 리뷰 get' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    description:
      '리뷰: id, rate, content, time 반환, user: imgUrl, nickname 반환',
    type: [ToiletsReivew],
  })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
  })
  @Post('toilet')
  async getToiletReview(
    @Body() toiletReportDto: ToiletReportDto,
  ): Promise<ToiletsReivew[]> {
    return await this.reviewsService.getToiletReview(toiletReportDto);
  }

  @ApiOperation({ summary: '리뷰 수정 api' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: ReviewEntity,
  })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
  })
  @Patch('modify')
  async modifyReview(
    @Body() reviewModifyDto: ReviewModifyDto,
  ): Promise<ReviewEntity> {
    return await this.reviewsService.modifyReview(
      reviewModifyDto,
      this.toiletImgUrl,
    );
  }

  @ApiOperation({ summary: '리뷰 신고 API' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
  })
  @ApiResponse({
    status: 500,
    description: 'internal server error',
  })
  @Post('report')
  async reportReview(@Body() reviewIdDto: ReviewIdDto): Promise<ReviewEntity> {
    return await this.reviewsService.reportReview(reviewIdDto);
  }

  @ApiOperation({ summary: '리뷰 삭제 api' })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 200,
    type: ToiletEntity,
  })
  @Delete('delete/:id')
  async reviewDelete(@Param('id') reviewIdDto: string): Promise<ToiletEntity> {
    return await this.reviewsService.reviewDelete(reviewIdDto);
  }
}
