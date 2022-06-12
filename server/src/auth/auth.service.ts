import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserLoginDto } from 'src/users/dtos/user.login.dto';
import { UserEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private jwtService: JwtService,
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
    const payload = { email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      imgUrl: user.imgUrl,
    };
  }
}
