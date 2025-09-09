'use server';

// import { apiV1 } from '@/lib/api';
import { SignIn, SignResponse } from '@/types/auth.type';
import axios, { AxiosError } from 'axios';
import { cookies } from 'next/headers';

export const apiV1 = axios.create({
  baseURL: `${process.env.API_URL}/api/v1`,
  withCredentials: true,
});

export const signIn = async (formData: SignIn) => {
  try {
    const response = await apiV1.post<SignResponse>('/auth/login', formData);

    const data = response.data;

    if (data) {
      const cookieStore = await cookies();

      cookieStore.set('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 1,
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
