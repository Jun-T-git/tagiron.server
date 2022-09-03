import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RoomsModule } from './rooms/rooms.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { RedisService } from './redis/redis.service';
import { UsersService } from './users/users.service';
import { EventsGateway } from './events/events.gateway';
import { EventsModule } from './events/events.module';
import { ActionsService } from './actions/actions.service';
import { RoomsService } from './rooms/rooms.service';
import { ActionsController } from './actions/actions.controller';
import { ActionsModule } from './actions/actions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    RoomsModule,
    UsersModule,
    EventsModule,
    ActionsModule,
  ],
  controllers: [UsersController, ActionsController],
  providers: [
    RedisService,
    UsersService,
    EventsGateway,
    ActionsService,
    RoomsService,
  ],
})
export class AppModule {}
