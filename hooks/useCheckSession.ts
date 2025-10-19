'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cookieStorage } from '@/utils/cookies';
import { routes } from '@/lib/routes';

export const useCheckSession = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = cookieStorage.get('access_token');
    if (!token) {
      cookieStorage.clear('access_token');
      router.push(`${routes.signIn()}?redirectTo=${pathname}`);
    }
  }, [pathname, router]);
};
