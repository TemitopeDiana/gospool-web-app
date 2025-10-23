// hooks/useHydrateUser.ts
'use client';

import { currentUser } from '@/actions/current-user';
import { useStore } from '@/client--store';
import { useEffect, useState } from 'react';

export function useGetUser() {
  const { setUser, clearUser } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await currentUser();

        if (user && user.user) setUser(user.user);

        return;
      } catch {
        clearUser();
      } finally {
        setLoading(false);
      }
    })();
  }, [setUser, clearUser]);

  return { loading };
}
