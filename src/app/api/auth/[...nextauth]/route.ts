import NextAuth from 'next-auth';
import type { NextRequest } from 'next/server';
import { createAuthOptions } from './options';

export async function GET(req: NextRequest) {
  const authOptions = createAuthOptions(req);
  return await NextAuth(authOptions)(req);
}

export async function POST(req: NextRequest) {
  const authOptions = createAuthOptions(req);
  return await NextAuth(authOptions)(req);
}
