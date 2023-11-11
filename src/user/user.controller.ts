import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from "./user.service";
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto/jwt-auth.dto';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async search(@Param('id') id: string): Promise<object>{
    return this.userService.getUser(+id);
  }

  @Post("/lastactive")
  @UseGuards(AuthGuard('jwt'))
  async lastActive(
    @GetUser() user: JwtAuthDto,
  ): Promise<object>{
    return this.userService.getLastActive(user.userId);
  }
}