import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/users/users.interface';
import { Room } from './rooms.interface';

@Injectable()
export class RoomsService {
  constructor(private redisService: RedisService) {}

  async create() {
    const key = 'rooms';
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // 文字種類
    const N = 8; // 文字数
    let roomId = '';
    do {
      roomId = Array.from(Array(N))
        .map(() => S[Math.floor(Math.random() * S.length)])
        .join('');
    } while (await this.redisService.redis.sismember(key, roomId));
    const [err, result] = await this.redisService.redis
      .pipeline()
      .sadd(key, roomId)
      .expire(key, 60 * 60 * 6)
      .exec();
    return roomId;
  }

  async findAll() {
    const rooms = await this.redisService.redis.smembers('rooms');
    return rooms;
  }

  async createPlayer(roomId: string) {
    const key = `room:${roomId}:players`;
    let i = 1;
    let playerId = `Player${i}`;
    while (await this.redisService.redis.sismember(key, playerId)) {
      i += 1;
      playerId = `Player${i}`;
    }
    const [err, result] = await this.redisService.redis
      .pipeline()
      .sadd(key, playerId)
      .expire(key, 60 * 60 * 6)
      .exec();
    return playerId;
  }

  async deletePlayer(playerId: string, roomId: string) {
    const key = `room:${roomId}:players`;
    const playerNum = await this.redisService.redis.srem(key, playerId);
    return playerNum;
  }

  async findAllPlayers(roomId: string) {
    const key = `room:${roomId}:players`;
    const players = await this.redisService.redis.smembers(key);
    return players;
  }

  async findOne(roomId: string | null) {
    const isMember = await this.redisService.redis.sismember('rooms', roomId);
    return isMember ? roomId : null;
  }
}
