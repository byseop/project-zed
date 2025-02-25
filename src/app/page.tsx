import { getServerSession } from 'next-auth';
import { getAuthOptions } from './api/auth/[...nextauth]/auth-utils';

export default async function Home() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1>App Router Simple Example</h1>
      <p>Welcome, {session?.user?.name ?? 'Guest'}!</p>

      {!session && (
        <>
          <p>You are not signed in.</p>
          <p>
            <a href="/auth/login">Sign in</a>
          </p>
        </>
      )}

      {session && (
        <>
          <p>Your data:</p>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
