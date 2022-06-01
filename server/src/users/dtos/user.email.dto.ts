import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../users.entity';

export class UserEmailDto extends PickType(UserEntity, ['email']) {}
