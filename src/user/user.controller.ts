import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from "./user.service";

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async search(@Param('id') id: string): Promise<object>{
    return this.userService.getUser(+id);
  }
}