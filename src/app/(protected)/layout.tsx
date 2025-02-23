import { FC, PropsWithChildren } from 'react';
import { getServerSession, Session } from 'next-auth';
import { createAuthOptions } from '@/app/api/auth/[...nextauth]/options';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const ProtectedLayout: FC<PropsWithChildren> = async ({ children }) => {
  const headersList = await headers();
  const session = (await getServerSession(
    createAuthOptions({
      headers: headersList
    } as any)
  )) as Session & {
    status: number | null;
  };

  if (!session || !session.user) {
    const xUrl = headersList.get('x-url');
    redirect(
      `/auth/login${xUrl ? `?callbackUrl=${encodeURIComponent(xUrl)}` : ''}`
    );
  }

  if (session.status) {
    const error = session.status;
    const headerUrl = headersList.get('x-url');

    if (error > 100) {
      let refreshTokenUrl = '/api/token/refresh';
      if (headerUrl) {
        refreshTokenUrl += `?callbackUrl=${encodeURIComponent(headerUrl)}`;
      }
      redirect(refreshTokenUrl);
    }

    if (error > 1000) {
      redirect('/api/auth/logout');
    }
  }

  return <>{children}</>;
};

export default ProtectedLayout;
