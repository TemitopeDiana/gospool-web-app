'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { routes } from '@/lib/routes';

export const checkSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const headerList = await headers();
  const fullUrl = headerList.get('x-url') || headerList.get('referer');
  let pathname = routes.home();

  try {
    if (fullUrl) {
      pathname = new URL(fullUrl).pathname;
    } else {
      pathname = headerList.get('x-pathname') || routes.home();
    }
  } catch {
    pathname = '/';
  }

  if (!token) {
    redirect(`${routes.signIn()}?redirectTo=${encodeURIComponent(pathname)}`);
  }

  return {
    isAuthenticated: true,
    token,
    pathname,
  };
};
