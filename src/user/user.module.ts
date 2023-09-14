import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SettingsModule } from "./settings/settings.module";

@Module({
    imports: [SettingsModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}