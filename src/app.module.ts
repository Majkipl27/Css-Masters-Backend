import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DbModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { SearchModule } from './search/search.module';
import { UserModule } from './user/user.module';
import { PlayModule } from './Play/Play.module';

@Module({
  imports: [
    AuthModule,
    DbModule,
    SearchModule,
    UserModule,
    PlayModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
