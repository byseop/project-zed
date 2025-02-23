import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession();
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
