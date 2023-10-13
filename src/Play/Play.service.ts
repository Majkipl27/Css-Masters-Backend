import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { SubmitDto } from './dto/submit.dto';

@Injectable()
export class PlayService {
  constructor(private readonly prisma: DbService) {}

  async getStartingData(
    challengeId: number,
    playlistId: number,
  ): Promise<{ startingScore: number; imageUrl: string }> {
    const challenge = await this.prisma.challenges.findFirstOrThrow({
      where: {
        playlistId: playlistId,
        challengeInPlaylistId: challengeId,
      },
    });
    return {
      startingScore: challenge.startingScore,
      imageUrl: challenge.challangeImageUrl,
    };
  }

  async submitScore(
    userId: number,
    data: SubmitDto,
    score: number,
  ): Promise<void> {
    const challenge = await this.prisma.challenges.findFirst({
      where: {
        playlistId: data.playlistId,
        challengeInPlaylistId: data.challengeId,
      },
      select: {
        id: true,
      },
    });

    const bestScore = await this.prisma.scores.findFirst({
      where: {
        challenge: {
          playlistId: data.playlistId,
          challengeInPlaylistId: data.challengeId,
        },
        userId: userId,
      },
      select: {
        id: true,
        score: true,
      },
      orderBy: {
        score: 'desc',
      },
    });

    if (bestScore && bestScore.score < score) {
      await this.prisma.scores.update({
        where: {
          id: bestScore.id,
        },
        data: {
          score: score,
          code: data.code,
        },
      });
    } else if (!bestScore) {
      await this.prisma.scores.create({
        data: {
          score: score,
          code: data.code,
          userId: userId,
          challengeId: challenge.id,
        },
      });
    }
  }

  async getTopScores(playlistId: number, challengeId: number): Promise<any> {
    const topScores = await this.prisma.scores.findMany({
      where: {
        challenge: {
          challengeInPlaylistId: challengeId,
          playlistId: playlistId,
        },
      },
      select: {
        score: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        score: 'desc',
      },
      take: 3,
    });
    return topScores;
  }

  async getPlaylists(): Promise<any> {
    const playlists = await this.prisma.playlists.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        additionalComment: true,
        description: true,
        difficulty: true,
        author: true,
        updatedAt: true,
        Challenges: {
          select: {
            id: true,
            name: true,
            challangeImageUrl: true,
            challengeInPlaylistId: true,
          },
        },
      },
    });
    return playlists;
  }

  async getScoreByScoreId(
    playlistId: number,
    challengeId: number,
    scoreId: number,
  ): Promise<any> {
    const score = await this.prisma.scores.findFirst({
      where: {
        id: scoreId,
        challenge: {
          playlistId: playlistId,
          challengeInPlaylistId: challengeId,
        },
      },
      select: {
        score: true,
        code: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return score;
  }

  async getUserScore(
    userId: number,
    playlistId: number,
    challengeId: number,
    limit?: number,
  ): Promise<any> {
    const userScore = await this.prisma.scores.findMany({
      where: {
        userId: userId,
        challenge: {
          playlistId: playlistId,
          challengeInPlaylistId: challengeId,
        },
      },
      select: {
        score: true,
        code: true,
        createdAt: true,
      },
      orderBy: [
        {
          score: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return userScore ? (limit ? userScore.slice(0, limit) : userScore[0]) : {};
  }


  async getChallenge(playlistId: number, challengeId: number): Promise<any> {
    const challenge = await this.prisma.challenges.findFirst({
      where: {
        playlistId: playlistId,
        challengeInPlaylistId: challengeId,
      },
      select: {
        id: true,
        challangeImageUrl: true,
        colors: true,
      },
    });
    return challenge;
  }

  async getPlaylist(playlistId: number): Promise<any> {
    const playlist = await this.prisma.playlists.findFirst({
      where: {
        id: playlistId,
      },
      select: {
        id: true,
        name: true,
        image: true,
        additionalComment: true,
        description: true,
        difficulty: true,
        author: true,
        updatedAt: true,
        Challenges: {
          select: {
            id: true,
            name: true,
            challangeImageUrl: true,
            challengeInPlaylistId: true,
          },
        },
      },
    });
    return playlist;
  }
}
