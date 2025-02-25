import { type NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getToken, encode } from 'next-auth/jwt';
import dayjs from 'dayjs';

export async function GET(req: NextRequest) {
  const redirectUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || '/';

  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.redirect(new URL('/api/auth/logout', redirectUrl));
    }

    const searchParams = req.nextUrl.searchParams;
    const callbackUrl = searchParams.get('callbackUrl') || '/';

    if (
      !dayjs().isBefore(dayjs.unix(token.refreshTokenExpires as number)) || // 리프레시 토큰 만료됨
      !dayjs().isAfter(dayjs.unix(token.exp as number).subtract(1, 'hour')) || // 아직 만료 1시간 전이 아님
      !dayjs().isBefore(dayjs.unix(token.exp as number)) // 이미 만료됨
    ) {
      return NextResponse.redirect(new URL('/api/auth/logout', redirectUrl));
    }

    const newExp = dayjs().add(7, 'day').unix();
    const updatedToken = {
      ...token,
      exp: newExp,
      status: 0
    };

    const newJWT = await encode({
      token: updatedToken,
      secret: process.env.NEXTAUTH_SECRET!
    });

    const cookieStore = await cookies();
    cookieStore.set('next-auth.session-token', newJWT, {
      expires: dayjs().add(7, 'day').toDate(),
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.redirect(new URL(callbackUrl, redirectUrl));
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.redirect(new URL('/api/auth/logout', redirectUrl));
  }
}
