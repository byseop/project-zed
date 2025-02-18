import type { NextAuthOptions } from 'next-auth';
import type { NextRequest } from 'next/server';
import Steam from 'next-auth-steam';
import { headers } from 'next/headers';
import { AUTH_STATUS } from './status';
import dayjs from 'dayjs';

export const createSteamProvider = (req: NextRequest) => {
  return Steam(req, {
    clientSecret: process.env.STEAM_SECRET!
  });
};

export const commonAuthOptions: Omit<NextAuthOptions, 'providers'> = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 0
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60
  },
  callbacks: {
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          steamId: token.sub
        },
        status: token.status || AUTH_STATUS.OK,
        expires: dayjs.unix(token.exp as number).toISOString()
      };
    },
    async jwt({ token, account }) {
      const headerValues = await headers();
      if (account) {
        token.steamId = account.providerAccountId;
        token.userAgent = headerValues.get('user-agent');
        token.lastIp = headerValues.get('x-forwarded-for');
        token.refreshTokenExpires = dayjs().add(30, 'day').unix();
        token.exp = dayjs().add(7, 'day').unix();
        token.iat = dayjs().unix();
      }

      const userAgent = headerValues.get('user-agent');
      const currentIp = headerValues.get('x-forwarded-for');

      // 유저 에이전트가 다른 경우
      if (token.userAgent !== userAgent) {
        return {
          ...token,
          exp: 0,
          iat: 0,
          status: AUTH_STATUS.USER_AGENT_NOT_MATCHED
        };
      }

      // IP가 다른 경우
      if (token.lastIp !== currentIp) {
        return {
          ...token,
          exp: 0,
          iat: 0,
          status: AUTH_STATUS.IP_NOT_MATCHED
        };
      }

      // 리프레시 토큰 만료
      if (
        dayjs().isAfter(dayjs.unix(token.exp as number)) &&
        dayjs().isAfter(dayjs.unix(token.refreshTokenExpires as number))
      ) {
        return {
          ...token,
          exp: 0,
          iat: 0,
          status: AUTH_STATUS.REFRESH_TOKEN_EXPIRED
        };
      }

      // 리프레시 토큰 유효 && 액세스 토큰 만료 1시간 전
      if (
        dayjs().isBefore(dayjs.unix(token.refreshTokenExpires as number)) &&
        dayjs().isAfter(dayjs.unix(token.exp as number).subtract(1, 'hour')) &&
        dayjs().isBefore(dayjs.unix(token.exp as number))
      ) {
        const newExp = dayjs().add(7, 'day').unix();
        return {
          ...token,
          exp: newExp,
          iat: dayjs().unix(),
          status: AUTH_STATUS.ACCESS_TOKEN_REFRESH
        };
      }

      return token;
    }
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/'
      }
    }
  }
};

export const createAuthOptions = (req: NextRequest): NextAuthOptions => ({
  ...commonAuthOptions,
  providers: [createSteamProvider(req)]
});
