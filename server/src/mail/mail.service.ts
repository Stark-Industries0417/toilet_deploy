import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEmailDto } from 'src/users/dtos/user.email.dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail({ email }: UserEmailDto) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'anstjdrnjs3@naver.com',
        subject: '비밀번호 재설정',
        html: '<p>http://localhost:3000/find_password</p>',
      });
    } catch (err) {
      console.log(err);
    }
    return 'http://localhost:3000/find_password';
  }
}
