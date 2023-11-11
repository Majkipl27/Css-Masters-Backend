import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SettingsModule } from "./settings/settings.module";
import { LeaderboardsService } from "src/leaderboards/leaderboards.service";
import { BadgesService } from "src/badges/badges.service";

@Module({
    imports: [SettingsModule],
    controllers: [UserController],
    providers: [UserService, LeaderboardsService, BadgesService]
})
export class UserModule {}