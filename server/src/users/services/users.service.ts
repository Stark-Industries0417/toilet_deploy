import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserEntity } from '../users.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../dtos/user.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  readonly userFilter = (user: UserEntity): UserResponseDto => ({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    imgUrl: user.imgUrl,
  });

  async signUp(userRegisterDto: UserRegisterDto): Promise<UserResponseDto> {
    const { email, password, checkPassword, nickname } = userRegisterDto;
    const hasEmail = await this.usersRepository.findOne({ email });
    const hasNickname = await this.usersRepository.findOne({ nickname });
    if (hasEmail) {
      throw new UnauthorizedException('이미 가입된 이메일 입니다.');
    }

    if (password !== checkPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    if (hasNickname) {
      throw new UnauthorizedException('이미 사용중인 닉네임 입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.save({
      email,
      password: hashedPassword,
      nickname,
    });
    return this.userFilter(user);
  }
}
