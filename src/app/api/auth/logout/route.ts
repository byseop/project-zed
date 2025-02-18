import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  // 세션 관련 모든 쿠키 삭제
  const cookieStore = await cookies();
  cookieStore.delete('next-auth.session-token');
  cookieStore.delete('next-auth.callback-url');
  cookieStore.delete('next-auth.csrf-token');

  return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL!));
}
