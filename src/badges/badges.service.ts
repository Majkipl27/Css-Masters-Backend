import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: DbService) {}

  getBadges() {
    return this.prisma.badges.findMany();
  }

  getUserBadges(userId: number) {
    return this.prisma.userBadges.findMany({
      where: {
        userId,
      },
    });
  }

  async giveBadge(userId: number, badgeId: number) {
    const badge = await this.prisma.userBadges.findFirst({
      where: {
        userId,
        badgeId,
      },
    });

    if (badge) return false;

    await this.prisma.userBadges.create({
      data: {
        userId,
        badgeId,
      },
    });

    return true;
  }

  async givePlayBadges(
    userId: number,
    misMatchPercentage: number,
    playlistId: number,
  ) {
    let gettingStartedBadge: boolean = await this.giveBadge(userId, 2);
    let playlistSmasherBadge: boolean;
    let pixelPerfectBadge: boolean;

    if (misMatchPercentage === 0) {
      pixelPerfectBadge = await this.giveBadge(userId, 4);
    }

    const challenges = await this.prisma.challenges.findMany({
      where: {
        playlistId,
      },
    });

    const userScores = await this.prisma.scores.findMany({
      where: {
        userId,
      },
    });

    const userChallenges = challenges.filter((challenge) =>
      userScores.some((score) => score.challengeId === challenge.id),
    );

    if (userChallenges.length === challenges.length) {
      playlistSmasherBadge = await this.giveBadge(userId, 3);
    }

    return gettingStartedBadge || pixelPerfectBadge || playlistSmasherBadge;
  }
}
