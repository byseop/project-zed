'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import LoginButtons from '@/components/LoginButtons';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const projetName = process.env.NEXT_PUBLIC_PROJECT_NAME;
  const handleClickLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signIn('steam');
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">{projetName}</span>
            </a>
            <h1 className="text-xl font-bold text-center">
              진짜 게이머들의 리뷰가 시작되는 곳<br />
              {projetName}
            </h1>
            <div className="text-center text-sm">
              계정이 없으신가요?{' '}
              <a
                href="#"
                className="underline underline-offset-4"
                onClick={handleClickLogin}
              >
                회원가입
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <LoginButtons />
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
