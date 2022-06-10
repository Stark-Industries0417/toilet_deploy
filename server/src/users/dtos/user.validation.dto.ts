import { OmitType } from '@nestjs/swagger';
import { UserRegisterDto } from './user.register.dto';

export class ValidationDto extends OmitType(UserRegisterDto, ['nickname']) {}
