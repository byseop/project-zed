'use client';

import { useGetProvidersQuery } from '@/apis/auth/getProviders/query';
import { signIn } from 'next-auth/react';

export default function AuthButton() {
  const { data: providers } = useGetProvidersQuery();
  return (
    <div>
      {providers &&
        Object.values(providers).map((provider) => (
          <button key={provider.id} onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        ))}
    </div>
  );
}
