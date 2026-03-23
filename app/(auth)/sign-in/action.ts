'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';

import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import type { SignResponse } from '@/types/auth.type';
import { encrypt } from '@/utils/encrypt';

const SignInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(4, { message: 'Password must be at least 4 characters' }),
});

export interface InitialSignInState extends ApiResponse<SignResponse> {
  errors?: Record<string, string[]>;
  values?: Record<string, unknown>;
  redirectTo?: string;
}

export async function signIn(
  prevState: InitialSignInState,
  formData: FormData
): Promise<InitialSignInState> {
  const fields = Object.fromEntries(formData.entries());

  const validated = SignInSchema.safeParse(fields);

  // 🔴 Validation error
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      values: fields,
    };
  }

  try {
    // ✅ Correct API typing
    const response = await api.post<ApiResponse<SignResponse>>(
      '/auth/login',
      validated.data
    );

    const result = response.data;

    console.log('Sign In Response:', result);

    // 🔴 Backend returned failure
    if (!result.success || !result.data) {
      return {
        success: false,
        message: result.message || 'Invalid credentials',
        values: fields,
      };
    }

    const { token, refreshToken } = result.data;

    // 🔴 Extra safety check
    if (!token || !refreshToken) {
      throw new Error('Invalid authentication response');
    }

    const cookieStore = await cookies();

    const encryptedToken = encrypt(token);
    const encryptedRefreshToken = encrypt(refreshToken);

    cookieStore.set('access_token', encryptedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 2,
    });

    cookieStore.set('refresh_token', encryptedRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: result.message || 'Sign in successful',
      data: result.data,
    };
  } catch (error: unknown) {
    console.error('Sign In Error:', error);

    if (error instanceof AxiosError) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          error.response?.data?.error ||
          'Login failed',
        values: fields,
      };
    }

    return {
      success: false,
      message: 'Unexpected error occurred',
      values: fields,
    };
  }
}
