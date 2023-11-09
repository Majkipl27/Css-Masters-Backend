import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class LeaderboardsService {
  constructor(private readonly prisma: DbService) {}

  async getLeaderboards() {
    let summedScores = await this.prisma.scores.groupBy({
      by: ['userId'],
      _sum: {
        score: true,
      },
      orderBy: {
        _sum: {
          score: 'desc',
        },
      },
    });

    const scores = await this.prisma.users.findMany({
      where: {
        id: {
          in: summedScores.map((score) => score.userId),
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    summedScores.forEach((score) => {
      const user = scores.find((user) => user.id === score.userId);
      delete user.id;
      Object.assign(score, score._sum);
      delete score._sum;
      Object.assign(score, user);
    });

    scores.forEach((user) => {
      delete user.id;
    });

    let summedChallengesCompleted = await this.prisma.scores.groupBy({
      by: ['userId'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
    });

    const challengesCompleted = await this.prisma.users.findMany({
      where: {
        id: {
          in: summedChallengesCompleted.map((score) => score.userId),
        },
      },
      select: {
        id: true,
        username: true,
      },
    });

    summedChallengesCompleted.forEach((score) => {
      const user = challengesCompleted.find((user) => user.id === score.userId);
      Object.assign(score, {
        username: user.username,
        totalChallengesCompleted: score._count.id,
      });
      delete score._count;
    });

    return { summedScores, summedChallengesCompleted };
  }

  async getTopLeaderboards() {
    let { summedScores, summedChallengesCompleted } =
      await this.getLeaderboards();

    summedScores = summedScores.slice(0, 10);
    summedChallengesCompleted = summedChallengesCompleted.slice(0, 10);

    return {
      topScores: summedScores,
      topChallangesCount: summedChallengesCompleted,
    };
  }

  async getUserPlace(userId: number) {
    let { summedScores, summedChallengesCompleted } =
      await this.getLeaderboards();

    let userScorePlace = summedScores.findIndex(
      (score) => score.userId === userId,
    ) + 1;

    let userChallangesPlace = summedChallengesCompleted.findIndex(
      (score) => score.userId === userId,
    ) + 1;

    return {
      userScorePlace,
      userChallangesPlace,
    };
  }
}
