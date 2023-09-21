import { Injectable } from '@nestjs/common';
import { DbService } from '../../db/db.service';
import { SettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: DbService) {}
  async updateSettings(
    userId: number,
    settings: SettingsDto,
    bannerFile?: Express.Multer.File,
    avatarFile?: Express.Multer.File,
  ): Promise<void> {
    if (avatarFile) await this.updateAvatar(avatarFile, userId);
    if (bannerFile) await this.updateBanner(bannerFile, userId);
    await this.prisma.users.update({
      where: { id: userId },
      data: {
        username: settings.username,
        name: settings.name,
        lastname: settings.lastname,
        x: settings.x,
        instagram: settings.instagram,
        github: settings.github,
        website: settings.website,
        description: settings.description,
      },
    });
  }

  async updateAvatar(
    avatarFile: Express.Multer.File,
    userId: number,
  ): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: { avatar: avatarFile.buffer },
    });
  }

  async updateBanner(
    bannerFile: Express.Multer.File,
    userId: number,
  ): Promise<void> {
    await this.prisma.users.update({
      where: { id: userId },
      data: { banner: bannerFile.buffer },
    });
  }

  async getSettings(userId: number): Promise<object> {
    return this.prisma.users.findUniqueOrThrow({
      where: { id: userId },
      select: {
        username: true,
        email: true,
        name: true,
        lastname: true,
        x: true,
        instagram: true,
        github: true,
        website: true,
        description: true,
      },
    });
  }

  async getAvatar(userId: number): Promise<Buffer | null> {
    return this.prisma.users
      .findUniqueOrThrow({
        where: { id: userId },
        select: { avatar: true },
      })
      .then((user) => user.avatar);
  }

  async getBanner(userId: number): Promise<Buffer | null> {
    return this.prisma.users
      .findUniqueOrThrow({
        where: { id: userId },
        select: { banner: true },
      })
      .then((user) => user.banner);
  }
}
