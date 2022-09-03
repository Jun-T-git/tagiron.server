import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from './users.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() roomId: string): Promise<User> {
    const user = this.usersService.create(roomId);
    return user;
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
