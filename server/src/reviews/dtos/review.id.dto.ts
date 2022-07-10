import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ReviewIdDto {
  @ApiProperty({
    example: 'c33c7d1b-fbef-48f9-9ca1-20384f6b1560',
    description: 'review의 id 입니다',
  })
  @IsUUID()
  id: string;
}
