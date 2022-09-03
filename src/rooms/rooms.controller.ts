import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { EventsGateway } from 'src/events/events.gateway';

@Controller('rooms')
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private eventsGateway: EventsGateway,
  ) {}

  @Post()
  async create(): Promise<string> {
    const roomId = await this.roomsService.create();
    return roomId;
  }

  @Get()
  async findAll(): Promise<string[]> {
    const roomIds = await this.roomsService.findAll();
    return roomIds;
  }

  @Get(':roomId')
  async findOne(@Param('roomId') roomId: string): Promise<string | null> {
    const rid = await this.roomsService.findOne(roomId);
    return rid;
  }

  @Post(':roomId/players')
  async createPlayer(@Param('roomId') roomId: string): Promise<string> {
    const playerId = await this.roomsService.createPlayer(roomId);
    const players = await this.roomsService.findAllPlayers(roomId);
    this.eventsGateway.server.emit('players', players);
    return playerId;
  }

  @Get(':roomId/players')
  async findAllPlayers(@Param('roomId') roomId: string): Promise<string[]> {
    const playerIds = await this.roomsService.findAllPlayers(roomId);
    return playerIds;
  }
}
