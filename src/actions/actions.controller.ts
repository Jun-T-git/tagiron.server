import { Body, Controller, Param, Post } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { RoomsService } from 'src/rooms/rooms.service';
import { Action, Challenge, Question } from './actions.interface';
import { ActionsService } from './actions.service';

@Controller(':roomId/actions')
export class ActionsController {
  constructor(
    private actionsService: ActionsService,
    private roomsService: RoomsService,
    private eventsGateway: EventsGateway,
  ) {}

  @Post('question')
  async Question(
    @Param('roomId') roomId: string,
    @Body() question: Question,
  ): Promise<Action[]> {
    // 質問の配信
    this.eventsGateway.server.emit('action', {
      senderId: question.senderId,
      content: `[質問] by ${question.senderId}`,
    });
    // 回答の配信
    const receivers = await this.actionsService.getReceivers(
      roomId,
      question.senderId,
    );
    const responses = receivers.map((receiverId) => {
      const response = {
        senderId: receiverId,
        content: `[質問回答] by ${receiverId}`,
      };
      this.eventsGateway.server.emit('action', response);
      return response;
    });
    return responses;
  }

  @Post('challenge')
  async Challenge(
    @Param('roomId') roomId: string,
    @Body() challenge: Challenge,
  ): Promise<Action[]> {
    // 宣言の配信
    this.eventsGateway.server.emit('action', {
      senderId: challenge.senderId,
      content: `[宣言] by ${challenge.senderId}`,
    });
    // 回答の配信
    const receivers = await this.actionsService.getReceivers(
      roomId,
      challenge.senderId,
    );
    const responses = receivers.map((receiverId) => {
      const response = {
        senderId: receiverId,
        content: `[宣言回答] by ${receiverId}`,
      };
      this.eventsGateway.server.emit('action', response);
      return response;
    });
    return responses;
  }

  @Post()
  async askQuestion(): Promise<string> {
    const roomId = await this.roomsService.create();
    return roomId;
  }
}
