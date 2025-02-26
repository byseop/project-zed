import { RedisClientType } from 'redis';
import { getRedisClient } from '@/lib/redisClient';
import axios from 'axios';

const TWITCH_TOKEN_KEY = 'twitch:access_token';
const TWITCH_EXPIRY_KEY = 'twitch:expires_at';

export async function getTwitchToken(): Promise<string> {
  const redis = await getRedisClient();

  // 1. 레디스에서 트위치 토큰을 가져온다.
  const [accessToken, expiryTimestamp] = await Promise.all([
    redis.get(TWITCH_TOKEN_KEY),
    redis.get(TWITCH_EXPIRY_KEY)
  ]);

  // 2. 토큰이 있고, 만료되지 않았다면 반환한다.
  const now = Date.now();
  if (accessToken && expiryTimestamp && parseInt(expiryTimestamp, 10) > now) {
    return accessToken;
  }

  // 3. 토큰이 없거나, 만료되었으면 새로 발급한다.
  return await refreshTwitchToken(redis);
}

async function refreshTwitchToken(redis: RedisClientType): Promise<string> {
  const clientID = process.env.TWITCH_CLIENT_ID!;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET!;

  const twitchTokenURL = new URL('https://id.twitch.tv/oauth2/token');
  twitchTokenURL.searchParams.append('client_id', clientID);
  twitchTokenURL.searchParams.append('client_secret', clientSecret);
  twitchTokenURL.searchParams.append('grant_type', 'client_credentials');

  try {
    const response = await axios.post(twitchTokenURL.toString());
    const { access_token, expires_in } = response.data;

    const expiresAt = Date.now() + expires_in * 1000;

    const pipeline = redis.multi();
    pipeline.set(TWITCH_TOKEN_KEY, access_token);
    pipeline.set(TWITCH_EXPIRY_KEY, expiresAt.toString());

    // 안전하게 만료 시간을 1시간 앞으로 설정
    pipeline.expire(TWITCH_TOKEN_KEY, expires_in - 60 * 60);
    pipeline.expire(TWITCH_EXPIRY_KEY, expires_in - 60 * 60);
    await pipeline.exec();

    return access_token;
  } catch (error) {
    console.error('Failed to refresh Twitch token:', error);
    throw error;
  }
}
