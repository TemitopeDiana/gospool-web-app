'use server';

import { routes } from '@/lib/routes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const signOut = async () => {
  const cookieStore = await cookies();

  cookieStore.getAll().forEach((cookie) => {
    cookieStore.set(cookie.name, '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });
  });

  redirect(routes.signIn());
};
