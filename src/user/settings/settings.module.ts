import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { BadgesService } from 'src/badges/badges.service';

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, BadgesService],
})
export class SettingsModule {}
