import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { UserEntity } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ToiletsModule } from './toilets/toilets.module';
import { OptionsModule } from './options/options.module';
import { ToiletEntity } from './toilets/toilets.entity';
import { ReviewEntity } from './reviews/reviews.entity';
import { OptionEntity } from './options/options.entity';

const typeOrmModuleOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [UserEntity, ToiletEntity, ReviewEntity, OptionEntity],
    synchronize: true,
    autoLoadEntities: true,
    logging: true,
    keepConnectionAlive: true,
    timezone: 'Z',
  }),
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(5000),
        SECRET_KEY: Joi.string().required(),
        ADMIN_USER: Joi.string().required(),
        ADMIN_PASSWORD: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    UsersModule,
    AuthModule,
    MailModule,
    ReviewsModule,
    ToiletsModule,
    OptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
