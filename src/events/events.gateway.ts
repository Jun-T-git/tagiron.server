import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { Challenge, Question } from 'src/actions/actions.interface';
import { RoomsService } from 'src/rooms/rooms.service';
import { Room } from 'src/rooms/rooms.interface';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private roomsService: RoomsService) {}

  @WebSocketServer()
  server: Server;

  //ログ出力用
  private logger: Logger = new Logger('EventsGateway');

  @SubscribeMessage('exitRoom')
  async handleExitRoom(
    @MessageBody() data: { playerId: string; roomId: string },
  ) {
    await this.roomsService.deletePlayer(data.playerId, data.roomId);
    this.logger.log(`User ${data.playerId} exited room ${data.roomId}`);
    const players = await this.roomsService.findAllPlayers(data.roomId);
    this.server.emit('players', players);
  }

  afterInit() {
    //初期化
    this.logger.log('初期化しました。');
  }

  handleConnection(client: Socket) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    //クライアント切断時
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
