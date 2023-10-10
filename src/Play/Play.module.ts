import { Module } from "@nestjs/common";
import { PlayController } from "./Play.controller";
import { PlayService } from "./Play.service";

@Module({
    controllers: [PlayController],
    providers: [PlayService],
})

export class PlayModule {}