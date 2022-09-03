import { Injectable } from '@nestjs/common';
import { RoomsService } from 'src/rooms/rooms.service';

@Injectable()
export class ActionsService {
  constructor(private roomsService: RoomsService) {}
  async getReceivers(roomId: string, senderId: string) {
    const players = await this.roomsService.findAllPlayers(roomId);
    const receivers = players.filter((playerId) => playerId != senderId);
    return receivers;
  }
}
