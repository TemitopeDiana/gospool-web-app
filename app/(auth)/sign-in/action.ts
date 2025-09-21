'use server';

import { AxiosError } from 'axios';
import { cookies } from 'next/headers';

import { api } from '@/lib/api';
import type { SignIn, SignResponse } from '@/types/auth.type';

export const signIn = async (formData: SignIn) => {
  try {
    const response = await api.post<SignResponse>('/auth/login', formData);

    const data = response.data;

    if (data) {
      const cookieStore = await cookies();

      cookieStore.set('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      cookieStore.set('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return { success: true, data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }

    return { success: false, message: 'Unexpected error occurred' };
  }
};
