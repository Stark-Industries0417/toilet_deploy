import { Body } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { userInfo } from 'os';
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

  @UseGuards(JwtAuthGuard)
  @Post('additional')
  async toiletAdditional(
    @User() userInfo: UserEntity,
    @Body() toiletAddDto: ToiletAddDto,
  ) {
    return await this.toiletsService.toiletAdditional(userInfo, toiletAddDto);
  }
}
