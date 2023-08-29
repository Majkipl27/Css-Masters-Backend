import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/auth')
export class AuthController {
  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('jwt');
    res.clearCookie('user_info');
    res.send({ statusCode: true, message: 'Logout success' });
  }
}