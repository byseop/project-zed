import { LoginForm } from '@/components/LoginForm';
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect('/');
  }

  return (
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  );
}
