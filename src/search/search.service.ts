import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: DbService) {}

  async search(search: string): Promise<object[]> {
    return this.prisma.users.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            lastname: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
      },
    });
  }
}
