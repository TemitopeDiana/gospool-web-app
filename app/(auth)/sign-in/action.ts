'use server';

import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import type { SignResponse } from '@/types/auth.type';
import { AxiosError } from 'axios';
import { cookies } from 'next/headers';
import { z } from 'zod';

const SignInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' }),
});

export interface InitialSignInState extends ApiResponse<SignResponse> {
  errors?: Record<string, string[]>;
  redirectTo?: string;
}

export async function signIn(
  prevState: InitialSignInState,
  formData: FormData
): Promise<InitialSignInState> {
  const fields = Object.fromEntries(formData.entries());
  const validated = SignInSchema.safeParse(fields);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors };
  }

  try {
    const response = await api.post<SignResponse>(
      '/auth/login',
      validated.data
    );
    const data = response.data;

    if (data) {
      const cookieStore = await cookies();

      cookieStore.set('access_token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 10 * 60,
      });

      cookieStore.set('refresh_token', data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return {
        success: true,
        data,
        message: 'Sign in successful, redirecting...',
      };
    }

    return { success: false, message: 'Invalid credentials' };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
    return { success: false, message: 'Unexpected error occurred' };
  }
}
