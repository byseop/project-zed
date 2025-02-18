import LoginButtons from '@/components/LoginButtons';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession();
  return (
    <div>
      <h1>App Router Simple Example</h1>
      <p>Welcome, {session?.user?.name ?? 'Guest'}!</p>
      <LoginButtons />

      {session && (
        <>
          <p>Your data:</p>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
