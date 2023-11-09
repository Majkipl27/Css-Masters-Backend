import { Controller, Get, UseGuards } from "@nestjs/common";
import { LeaderboardsService } from "./leaderboards.service";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/auth/decorator/getUser.decorator";
import { JwtAuthDto } from "src/auth/dto/jwt-auth.dto";

@Controller("/leaderboards")
export class LeaderboardsController {
    constructor(private readonly leaderboardsService: LeaderboardsService) {}

    @Get()
    async getLeaderboards() {
        return await this.leaderboardsService.getLeaderboards();
    }

    @Get("/top")
    async getTopLeaderboards() {
        return await this.leaderboardsService.getTopLeaderboards();
    }

    @Get("/userplace")
    @UseGuards(AuthGuard('jwt'))
    async getUserPlace(@GetUser() user: JwtAuthDto,) {
        return await this.leaderboardsService.getUserPlace(user.userId);
    }
}