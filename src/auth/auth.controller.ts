import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('/auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt', {
      domain: this.configService.get<string>('DOMAIN'),
    });
    res.clearCookie('user_info', {
      domain: this.configService.get<string>('DOMAIN'),
    });
    res.send({ statusCode: true, message: 'Logout success' });
  }
}
