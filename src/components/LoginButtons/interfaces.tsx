import { JSX } from 'react';
import { BsSteam } from 'react-icons/bs';

export type ProviderId = 'steam';

export function isProviderId(id: string): id is ProviderId {
  return id in providersConstant;
}

export const providersConstant: Record<
  ProviderId,
  { name: string; icon: JSX.Element }
> = {
  steam: {
    name: 'Steam',
    icon: <BsSteam className="w-6 h-6" />
  }
} as const;
