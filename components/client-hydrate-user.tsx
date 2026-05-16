'use client';
import { useEffect } from 'react';
import { setUser } from '@/client--store';
import type { UserProfile } from '@/types/user.type';

interface Props {
  user?: UserProfile | null;
}

export default function ClientHydrateUser({ user }: Props) {
  useEffect(() => {
    if (user) {
      console.log('Hydrating user on client:', user);
      setUser(user);
    }
  }, [user]);

  return null;
}
