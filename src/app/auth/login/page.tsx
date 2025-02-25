import { getAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { LoginForm } from '@/components/LoginForm';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  console.log('sessionCheck', session);
  if (session) {
    redirect('/');
  }

  return (
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  );
}
