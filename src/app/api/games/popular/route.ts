import { NextResponse } from 'next/server';
import { getPopularGames } from '@/apis/igdb';
import { withAuth } from '@/lib/withAuth';

async function handler() {
  try {
    const games = await getPopularGames();
    return NextResponse.json(games);
  } catch (error) {
    console.log('인기 게임 조회 실패:', error);
    return NextResponse.json(
      {
        message: '인기 게임을 조회할 수 없습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500
      }
    );
  }
}

export const GET = withAuth(handler);
