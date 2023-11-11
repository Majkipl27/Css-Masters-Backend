import { Controller, Get } from "@nestjs/common";
import { BadgesService } from "./badges.service";

@Controller("/badges")
export class BadgesController{
    constructor(private readonly badgesService: BadgesService) {}

    @Get()
    async getBadges() {
        return await this.badgesService.getBadges();
    }
}