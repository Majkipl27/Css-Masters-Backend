import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterModule } from './register/register.module';

@Module({
  imports: [forwardRef(() => RegisterModule)],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
