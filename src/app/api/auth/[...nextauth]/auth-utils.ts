import type { NextRequest } from 'next/server';
import { headers } from 'next/headers';
import { createAuthOptions } from './options';

export async function getAuthOptions() {
  const headersList = await headers();
  const req = {
    headers: {
      get: (name: string) => headersList.get(name)
    }
  } as NextRequest;

  return createAuthOptions(req);
}
