import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { RegisterDto } from './dto/register.dto';
import { sha512 } from 'js-sha512';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: DbService) {}

  async signup(dto: RegisterDto): Promise<object> {
    const sampleUser = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });
    if (sampleUser) throw new ForbiddenException('Credentials taken!');

    await this.prisma.users.create({
      data: {
        username: dto.username,
        passwordHash: sha512(dto.password),
        email: dto.email,
      },
    });

    return { msg: 'Successfully registered a new account!' };
  }
}
