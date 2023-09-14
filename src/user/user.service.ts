import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

@Injectable()
export class UserService {
    constructor(private readonly prisma: DbService) {}

    async getUser(id: number) {
        let user = this.prisma.users.findUnique({
            where: {
                id
            }
        })

        delete (await user).passwordHash;

        return user;
    }
}