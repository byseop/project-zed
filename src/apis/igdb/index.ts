import { getRedisClient } from '@/lib/redisClient';
import { getTwitchToken } from '@/lib/twitchToken';
import axios from 'axios';

// API 응답 캐싱 시간
const CACHE_TTL = 60 * 60;

// IGDB API URL
const IGDB_URL = 'https://api.igdb.com/v4';

export async function getIGDBData(endpoint: string, query: string) {
  const redis = await getRedisClient();
  const cacheKey = `igdb:${endpoint}:${Buffer.from(query).toString('base64')}`;

  // 1. 캐시가 있는지 확인한다.
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // 2. 캐시가 없으면 IGDB API에 요청한다.
  const clientId = process.env.TWITCH_CLIENT_ID!;
  const accessToken = await getTwitchToken();

  try {
    const response = await axios.post(`${IGDB_URL}/${endpoint}`, query, {
      headers: {
        Accept: 'application/json',
        'Client-ID': clientId,
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (response.status !== 200) {
      throw new Error(`IGDB response status: ${response.status}`);
    }

    // 3. API 응답을 캐싱한다.
    const { data } = response;
    await redis.set(cacheKey, JSON.stringify(data), { EX: CACHE_TTL });

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPopularGames() {
  const query = `
    fields name, cover.url, genres.name, platforms.name, rating, first_release_date;
    where rating > 75;
    sort rating desc;
    limit 10;
  `;

  return getIGDBData('games', query);
}

export async function searchGames(searchTerm: string, limit = 20) {
  const query = `
    fields name, cover.url, genres.name, platforms.name, rating, first_release_date;
    search "${searchTerm}";
    limit ${limit};
  `;

  return getIGDBData('games', query);
}
