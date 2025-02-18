import { getProviders as getProvidersNextAuth } from 'next-auth/react';

export const getProviders = async () => await getProvidersNextAuth();
