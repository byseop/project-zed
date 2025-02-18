import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { createAuthOptions } from './options';

async function auth(
  req: NextRequest,
  ctx: {
    params: { nextauth: string[] };
  }
) {
  if (!process.env.STEAM_SECRET) {
    throw new Error('Missing STEAM_SECRET environment variable');
  }

  const authOptions = createAuthOptions(req);
  return NextAuth(req, ctx, authOptions);
}

export { auth as GET, auth as POST };
