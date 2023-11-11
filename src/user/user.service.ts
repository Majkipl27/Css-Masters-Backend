import { Injectable } from '@nestjs/common';
import { BadgesService } from 'src/badges/badges.service';
import { DbService } from 'src/db/db.service';
import { LeaderboardsService } from 'src/leaderboards/leaderboards.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: DbService,
    private readonly leaderboardsService: LeaderboardsService,
    private readonly badgesService: BadgesService,
  ) {}

  async getUser(id: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (user) {
      delete user.passwordHash;
      delete user.avatar;
      delete user.banner;

      const userPlaces = await this.leaderboardsService.getUserPlace(+id);
      user['userScore'] = userPlaces.userScore;
      user['userChallangesCompleted'] = userPlaces.userChallangesCompleted;
      user['favouriteTags'] = await this.getUserFavouriteTags(id);
      user['userBadges'] = await this.getUserBadges(id);

      return user;
    } else {
      return { error: 'User not found' };
    }
  }

  async getUserFavouriteTags(id: number) {
    const userScores = await this.prisma.scores.findMany({
      where: {
        userId: id,
      },
      include: {
        challenge: {
          include: {
            playlist: true,
          },
        },
      },
    });

    const counts = {};

    userScores.forEach((score) => {
      const difficulty = score.challenge.playlist.difficulty;
      const tag = score.challenge.playlist.tag;

      if (!counts[difficulty]) {
        counts[difficulty] = 0;
      }

      if (!counts[tag] && tag !== null) {
        counts[tag] = 0;
      }

      if (tag !== null) counts[tag]++;
      counts[difficulty]++;
    });

    const sortedCounts = Object.entries(counts)
      .sort(([, a]: any, [, b]: any) => b - a)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    return sortedCounts;
  }

  async getUserBadges(id: number) {
    const userBadges = await this.prisma.userBadges.findMany({
      where: {
        userId: id,
      },
      select: {
        createdAt: true,
        badge: true,
      },
    });

    userBadges.forEach((badge) => {
      badge['name'] = badge.badge.name;
      badge['description'] = badge.badge.description;
      badge['imageId'] = badge.badge.imageId;

      delete badge.badge;
    });

    return userBadges;
  }

  async getLastActive(id: number) {
    let lastActive = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        lastSeen: new Date(),
      },
    });

    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    if (hour >= 22 || hour <= 4) {
      if (day === 0 || day === 6) {
        this.badgesService.giveBadge(id, 5);
      }
    }

    return lastActive.lastSeen || { error: 'User not found' };
  }
}
