'use server';

import { routes } from '@/lib/routes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const cookieStore = await cookies();

  cookieStore.getAll().forEach((cookie) => {
    cookieStore.delete(cookie.name);
  });

  redirect(routes.signIn());
};
