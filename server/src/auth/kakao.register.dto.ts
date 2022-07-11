import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserEntity } from 'src/users/users.entity';

export class KakaoRegisterDto extends PickType(UserEntity, [
  'email',
  'nickname',
  'imgUrl',
]) {
  @ApiProperty({
    example: 'KuMNbzL9riGDjv48v-nA7S-Lk-xmtA9CDTFKi1iiCisNHgAAAYHsyn5O',
  })
  @IsString()
  accessToken: string;
}
