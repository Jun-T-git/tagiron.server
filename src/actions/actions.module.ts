import { Module } from '@nestjs/common';
import { RoomsService } from 'src/rooms/rooms.service';
import { ActionsController } from './actions.controller';
import { ActionsService } from './actions.service';

@Module({
  controllers: [ActionsController],
  providers: [ActionsService, RoomsService],
})
export class ActionsModule {}
