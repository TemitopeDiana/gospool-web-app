'use server';

import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { routes } from '@/lib/routes';
import { encrypt } from '@/utils/encrypt';

export const refreshAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    cookieStore.delete('access_token');
    redirect(routes.signIn());
  }

  try {
    const res = await axios.post(
      '/api/auth/refresh-token',
      {},
      { withCredentials: true }
    );

    const { token } = res.data;

    cookieStore.set('access_token', encrypt(token), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return token;
  } catch (err) {
    console.error('Refresh request failed', err);
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    redirect(routes.signIn());
  }
};

export const setAuthCookies = async (access_token: string) => {
  const cookieStore = await cookies();

  cookieStore.set('access_token', encrypt(access_token), {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
  });
};
