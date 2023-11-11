import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PlayService } from './Play.service';
import { JwtAuthDto } from 'src/auth/dto/jwt-auth.dto';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { SubmitDto } from './dto/submit.dto';
import * as resemble from 'resemblejs';
import puppeteer from 'puppeteer';
import { Response } from 'express';
import { BadgesService } from 'src/badges/badges.service';

@Controller('play')
export class PlayController {
  constructor(
    private readonly playService: PlayService,
    private readonly badgesService: BadgesService,
  ) {}

  @Post('submit')
  @UseGuards(AuthGuard('jwt'))
  async submitScore(
    @GetUser() user: JwtAuthDto,
    @Body() data: SubmitDto,
    @Res() response: Response,
  ): Promise<{ score: number; misMatchPercentage: number }> {
    const startingData = await this.playService.getStartingData(
      data.challengeId,
      data.playlistId,
    );

    const codeFormatted = data.code
      .replace('</style>', '')
      .replaceAll(/\s/g, '');
    const screenshotBuffer = await this.captureScreenshot(data.code);

    const misMatchPercentage = await this.compareScreenshots(
      screenshotBuffer,
      startingData.imageUrl,
    );

    const wereBadgesAdded = await this.badgesService.givePlayBadges(
      user.userId,
      +misMatchPercentage,
      data.playlistId,
    );

    const score = this.calculateScore(
      startingData.startingScore,
      codeFormatted.length,
      misMatchPercentage,
    );

    await this.playService.submitScore(user.userId, data, score);

    response.status(wereBadgesAdded ? 201 : 200).json({
      statusCode: wereBadgesAdded ? 201 : 200,
      data: {
        score,
        misMatchPercentage,
        message: wereBadgesAdded ? 'Badge unlocked' : null,
      },
    });
    response.send();

    return { score, misMatchPercentage };
  }

  private async captureScreenshot(code: string): Promise<Buffer> {
    let browser = await puppeteer.launch({
      headless: 'new',
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 300 });
    await page.setContent(
      '<html><style>body, html{margin:0;width:400px;height:300px;background:#FFF;overflow:hidden;}' +
        code +
        '</html>',
    );
    const screenshotBuffer = await page.screenshot();
    await browser.close();
    return screenshotBuffer;
  }

  private async compareScreenshots(
    screenshotBuffer: Buffer,
    imageUrl: string,
  ): Promise<number> {
    return new Promise((resolve) => {
      resemble(`data:image/png;base64,${screenshotBuffer.toString('base64')}`)
        .compareTo(imageUrl)
        .onComplete((data) => {
          resolve(data.misMatchPercentage);
        });
    });
  }

  private calculateScore(
    startingScore: number,
    codeLength: number,
    misMatchPercentage: number,
  ): number {
    let score = startingScore - codeLength * 0.1 - misMatchPercentage * 10;
    if (score < 0) score = 0;
    return +score.toFixed(2);
  }

  @Get('/topScores/:playlistId/:challengeId')
  @UseGuards(AuthGuard('jwt'))
  async getTopScores(
    @Param('playlistId') playlistId: number,
    @Param('challengeId') challengeId: number,
  ): Promise<{
    topScores: { userID: number; username: string; score: number };
  }> {
    const topScores = await this.playService.getTopScores(
      playlistId,
      challengeId,
    );
    return topScores;
  }

  @Get('/score/:playlistId/:challengeId/:scoreId')
  @UseGuards(AuthGuard('jwt'))
  async getScore(
    @Param('playlistId') playlistId: number,
    @Param('challengeId') challengeId: number,
    @Param('scoreId') scoreId: number,
  ): Promise<any> {
    const score = await this.playService.getScoreByScoreId(
      playlistId,
      challengeId,
      scoreId,
    );
    return score;
  }

  @Get('/userScores/:playlistId/:challengeId/:userId')
  @UseGuards(AuthGuard('jwt'))
  async getUserScores(
    @Param('playlistId') playlistId: number,
    @Param('challengeId') challengeId: number,
    @Param('userId') userId: number,
  ): Promise<any> {
    const userScores = await this.playService.getUserScore(
      userId,
      playlistId,
      challengeId,
    );
    return userScores;
  }

  @Get('/bestUserScore/:playlistId/:challengeId/')
  @UseGuards(AuthGuard('jwt'))
  async getUserScore(
    @GetUser() user: JwtAuthDto,
    @Param('playlistId') playlistId: number,
    @Param('challengeId') challengeId: number,
  ): Promise<any> {
    const userScore = await this.playService.getUserScore(
      user.userId,
      playlistId,
      challengeId,
    );
    return userScore;
  }

  @Get('/playlists')
  async getPlaylists(): Promise<any> {
    const playlists = await this.playService.getPlaylists();
    return playlists;
  }

  @Get('/playlists/:playlistId')
  async getPlaylist(@Param('playlistId') playlistId: number): Promise<any> {
    const playlist = await this.playService.getPlaylist(playlistId);
    return playlist;
  }

  @Get('/:playlistId/:challengeId')
  @UseGuards(AuthGuard('jwt'))
  async getChallenge(
    @Param('playlistId') playlistId: number,
    @Param('challengeId') challengeId: number,
  ): Promise<any> {
    const challenge = await this.playService.getChallenge(
      playlistId,
      challengeId,
    );
    return challenge;
  }
}
