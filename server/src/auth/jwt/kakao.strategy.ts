import { PassportStrategy } from '@nestjs/passport';
import { Exception } from 'handlebars';
import { Strategy } from 'passport-kakao';
import { KakaoRegisterDto } from '../kakao.register.dto';

export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.clientID,
      callbackURL: process.env.callbackURL,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;
    if (!kakao_account.email) {
      throw new Exception('이메일 제공을 동의해 주세요.');
    }
    const kakaoRegisterDto: KakaoRegisterDto = {
      email: kakao_account.email,
      nickname: kakao_account.profile.nickname,
      imgUrl: kakao_account.profile.profile_image_url,
      accessToken,
    };
    done(null, kakaoRegisterDto);
  }
}
