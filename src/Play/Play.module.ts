import { Module } from "@nestjs/common";
import { PlayController } from "./Play.controller";
import { PlayService } from "./Play.service";
import { BadgesService } from "src/badges/badges.service";

@Module({
    controllers: [PlayController],
    providers: [PlayService, BadgesService],
})

export class PlayModule {}