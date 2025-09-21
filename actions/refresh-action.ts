'use server';

import { api } from '@/lib/api';
import { routes } from '@/lib/routes';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const refreshAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');
    redirect(routes.signIn());
  }

  try {
    const response = await api.post<{ token: string }>('/auth/refresh-token');

    const { token } = response.data;

    cookieStore.set('access_token', token, {
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
