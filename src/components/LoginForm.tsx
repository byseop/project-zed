'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import LoginButtons from '@/components/LoginButtons';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const projetName = process.env.NEXT_PUBLIC_PROJECT_NAME;
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [title, setTitle] = useState<string | null>(null);

  const handleClickLogin = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    signIn('steam', {
      callbackUrl: callbackUrl || undefined,
      redirect: false
    });
  };

  useEffect(() => {
    setTitle(
      loginTitleTextList[Math.floor(Math.random() * loginTitleTextList.length)]
    );
  }, []);

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
              {title}
              <br />
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
            <LoginButtons callbackUrl={callbackUrl || undefined} />
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

const loginTitleTextList: string[] = [
  '진짜 게이머들의 리뷰가 시작되는 곳',
  '게이머들의 솔직한 이야기',
  '진짜 게이머들의 리뷰가 시작되는 곳',
  '게임을 즐기는 당신의 이야기를 들려주세요',
  '당신의 한 줄 리뷰가 다음 게이머를 기다립니다'
];
