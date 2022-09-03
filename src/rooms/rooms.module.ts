import { Module } from '@nestjs/common';
import { EventsGateway } from 'src/events/events.gateway';
import { RedisService } from 'src/redis/redis.service';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService, EventsGateway, RedisService],
})
export class RoomsModule {}
