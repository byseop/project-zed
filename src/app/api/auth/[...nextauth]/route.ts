import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { createAuthOptions } from './options';
import { headers } from 'next/headers';

async function auth(req: NextRequest, ctx: any) {
  if (!process.env.STEAM_SECRET) {
    throw new Error('Missing STEAM_SECRET environment variable');
  }

  const authOptions = createAuthOptions(req);
  return NextAuth(req, ctx, authOptions);
}

export async function getAuthOptions() {
  const headersList = await headers();
  const req = {
    headers: {
      get: (name: string) => {
        if (typeof window === 'undefined') {
          return headersList.get(name);
        }
        return null;
      }
    }
  } as NextRequest;

  return createAuthOptions(req);
}

export { auth as GET, auth as POST };
