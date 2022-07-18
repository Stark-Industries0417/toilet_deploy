import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRegisterDto } from '../dtos/user.register.dto';
import { UserEntity } from '../users.entity';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from '../dtos/user.response.dto';
import { AwsService } from 'src/aws.service';
import { ConflictException } from '@nestjs/common';
import { UserEditNicknameInputDto } from '../dtos/user.modify.nickname.dto';
import { UserModifyPasswordDto } from '../dtos/user.modifyPassword.dto';
import { UserEmailDto } from '../dtos/user.email.dto';
import { ToiletEntity } from 'src/toilets/toilets.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ToiletEntity)
    private readonly toiletsRepository: Repository<ToiletEntity>,
    private readonly awsService: AwsService,
  ) {}

  private readonly userFilter = (user: UserEntity): UserResponseDto => ({
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    imgUrl: user.imgUrl,
  });

  async signUp(
    userRegisterDto: UserRegisterDto,
    userImg: string,
  ): Promise<UserResponseDto> {
    const { email, password, checkPassword, nickname } = userRegisterDto;
    const hasEmail = await this.usersRepository.findOne({ email });
    const hasNickname = await this.usersRepository.findOne({ nickname });
    if (hasEmail) {
      throw new ConflictException('이미 가입된 이메일 입니다.');
    }

    if (password !== checkPassword) {
      throw new ConflictException('비밀번호가 일치하지 않습니다.');
    }

    if (hasNickname) {
      throw new ConflictException('이미 사용중인 닉네임 입니다.');
    }
    const imgUrl = userImg;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.save({
      email,
      password: hashedPassword,
      nickname,
      imgUrl,
    });
    return this.userFilter(user);
  }

  async checkEmail(userEmailDto: UserEmailDto) {
    try {
      const hasEmail = await this.usersRepository.findOne({
        where: userEmailDto,
      });
      if (hasEmail) throw new ConflictException('이미 가입된 이메일 입니다.');
      return '가입 가능한 이메일 입니다.';
    } catch (err) {
      throw new ConflictException(err.message);
    }
  }

  async modifyNickname(
    user: UserEntity,
    { nickname }: UserEditNicknameInputDto,
  ) {
    const findNickname = await this.usersRepository.findOne({
      where: { nickname },
    });
    if (findNickname)
      throw new ConflictException('이미 사용중인 닉네임 입니다.');
    try {
      user.nickname = nickname;
      return await this.usersRepository.save(user);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async modifyUserImg(
    userInfo: UserEntity,
    modifyImg: string,
  ): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: userInfo,
    });
    user.imgUrl = modifyImg;
    await this.usersRepository.save(user);

    return this.userFilter(user);
  }

  async modifyPassword(
    userModifyPasswordDto: UserModifyPasswordDto,
    email: UserEmailDto,
    user?: UserEntity,
  ) {
    const { existPassword, password, checkPassword } = userModifyPasswordDto;

    const userInfo = await this.usersRepository.findOne(user ? user : email);

    const samePassword = await bcrypt.compare(password, userInfo.password);

    if (samePassword) {
      return '기존 비밀번호와 같습니다.';
    }
    if (existPassword) {
      const validatePassword = await bcrypt.compare(
        existPassword,
        userInfo.password,
      );
      if (!validatePassword)
        throw new ConflictException('비밀번호가 틀렸습니다.');
    }

    if (password !== checkPassword)
      throw new ConflictException('비밀번호가 일치하지 않습니다.');

    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      userInfo.password = hashedPassword;
      await this.usersRepository.save(userInfo);
      return this.userFilter(userInfo);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  async userWithdrawal(userInfo: UserEntity) {
    try {
      return await this.usersRepository.remove(userInfo);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
