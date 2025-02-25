import { FC, PropsWithChildren } from 'react';
import { getServerSession, Session } from 'next-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAuthOptions } from '../api/auth/[...nextauth]/route';

const ProtectedLayout: FC<PropsWithChildren> = async ({ children }) => {
  const headersList = await headers();
  const authOptions = await getAuthOptions();
  const session = (await getServerSession(authOptions)) as Session & {
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
