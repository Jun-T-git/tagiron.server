import { Injectable } from '@nestjs/common';
import { User } from './users.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(id: string) {
    const user = { id: id };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }
}
