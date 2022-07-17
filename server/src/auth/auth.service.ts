import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserLoginDto } from 'src/users/dtos/user.login.dto';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Payload } from './jwt/jwt.payload';
import { UsersService } from 'src/users/services/users.service';
import { KakaoRegisterDto } from './kakao.register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async jwtLogIn(data: UserLoginDto) {
    const { email, password } = data;
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요');
    }

    const isPasswordValidated: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!isPasswordValidated) {
      throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
    }
    const payload: Payload = { email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      imgUrl: user.imgUrl,
    };
  }

  async kakaoLogin(kakaoRegisterDto: KakaoRegisterDto) {
    const { email, nickname, imgUrl, accessToken } = kakaoRegisterDto;
    const hasUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (hasUser) {
      const payload: Payload = { email, sub: hasUser.id };
      const token = this.jwtService.sign(payload);
      return {
        token,
        id: hasUser.id,
        email: hasUser.email,
        nickname,
        imgUrl,
      };
    }
    const registerUser = await this.usersService.signUp(
      {
        email,
        password: accessToken,
        checkPassword: accessToken,
        nickname,
      },
      imgUrl,
    );

    const payload: Payload = { email, sub: registerUser.id };
    const token = this.jwtService.sign(payload);
    return {
      token,
      ...registerUser,
    };
  }
}
