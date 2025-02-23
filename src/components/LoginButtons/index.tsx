'use client';

import { useGetProvidersQuery } from '@/apis/auth/getProviders/query';
import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';
import {
  isProviderId,
  providersConstant,
  ProviderId,
  ILoginButtonsProps
} from './interfaces';

export default function LoginButtons({ callbackUrl }: ILoginButtonsProps) {
  const { data: providers } = useGetProvidersQuery();

  const handleClickLogin = (providerId: ProviderId) => {
    signIn(providerId, {
      callbackUrl: callbackUrl || undefined,
      redirect: false
    });
  };

  return (
    <div>
      {providers &&
        Object.values(providers).map((provider) => (
          <Button
            type="submit"
            className="w-full"
            key={provider.id}
            onClick={(e) => {
              e.preventDefault();
              handleClickLogin(provider.id as ProviderId);
            }}
          >
            {isProviderId(provider.id) && providersConstant[provider.id]?.icon}{' '}
            {isProviderId(provider.id) && providersConstant[provider.id]?.name}{' '}
            계정으로 간편하게 로그인
          </Button>
        ))}
    </div>
  );
}
