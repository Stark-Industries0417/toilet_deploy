import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Payload } from './jwt.payload';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from 'src/users/dtos/user.response.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: Payload): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne(payload.sub);

    if (user)
      return {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        imgUrl: user.imgUrl,
      };
    else throw new UnauthorizedException('접근 오류');
  }
}
