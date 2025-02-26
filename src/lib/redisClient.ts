import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (error) => {
      console.error('Redis error:', error);
    });

    redisClient.on('connect', () => {
      console.log('Redis connected');
    });

    await redisClient.connect();
  }

  return redisClient;
}
