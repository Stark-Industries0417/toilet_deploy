import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';

export class UserResponseDto extends PickType(UserEntity, [
  'email',
  'nickname',
  'imgUrl',
]) {
  @ApiProperty({
    example: '07ab3dc5-d781-4146-9b43-6749c54a2ff9',
    description: 'uuid',
  })
  id: string;
}
