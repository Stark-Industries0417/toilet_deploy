import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AwsService } from 'src/aws.service';
import { MailModule } from 'src/mail/mail.module';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UserEntity } from './users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => AuthModule),
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AwsService],
  exports: [TypeOrmModule.forFeature([UserEntity]), UsersService],
})
export class UsersModule {}
