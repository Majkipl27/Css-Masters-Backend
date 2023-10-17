import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { RegisterDto } from './dto/register.dto';
import { sha512 } from 'js-sha512';
import { LoginDto } from './dto/login.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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

  async login(dto: LoginDto): Promise<[string, string, object] | []> {
    const user = await this.prisma.users.findUniqueOrThrow({
      where: { username: dto.username },
    });

    if (sha512(dto.password) === user.passwordHash) {
      return this.generateAuthCookie({
        isBanned: user.isBanned,
        userId: user.id,
      });
    }
    throw new ForbiddenException('Wrong credentials!');
  }

  async generateAuthCookie(
    payload: JwtAuthDto,
  ): Promise<[string, string, object]> {
    const jwt = await this.generateAuthJwt(payload as JwtAuthDto);
    return [
      'jwt',
      jwt,
      {
        domain: this.configService.get<string>(
          'COOKIE_DOMAIN',
          this.configService.get<string>('DOMAIN'),
        ),
        secure: true,
        sameSite: 'lax',
      },
    ];
  }

  async generateAuthJwt(payload: JwtAuthDto): Promise<string> {
    console.log('payload: ', payload);
    return this.jwtService.sign(payload);
  }

  async getUserPublicInfo(username: string): Promise<object> {
    const { prisma } = this;
    const userPublicInfo: any = await prisma.users.findUniqueOrThrow({
      where: {
        username,
      },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        isBanned: true,
      },
    });

    return userPublicInfo;
  }
}
