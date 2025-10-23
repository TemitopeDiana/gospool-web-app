import { usePathname, useRouter } from 'next/navigation';

import { routes } from '@/lib/routes';
import { cookieStorage } from '@/utils/cookies';
import { useStore } from '@/client--store';

export const useSignOut = (aFunction?: () => void) => {
  const router = useRouter();

  const pathname = usePathname();

  const clearUser = useStore((state) => state.clearUser);

  const signOut = () => {
    cookieStorage.clearAll();
    clearUser();
    aFunction?.();
    return router.push(`${routes.signIn()}?redirectTo=${pathname}`);
  };

  return signOut;
};
