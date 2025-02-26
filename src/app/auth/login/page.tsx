import { getAuthOptions } from '@/app/api/auth/[...nextauth]/auth-utils';
import { LoginForm } from '@/components/LoginForm';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const authOptions = await getAuthOptions();
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }

  return (
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  );
}
