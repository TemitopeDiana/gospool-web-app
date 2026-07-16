'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';

import { ApiResponse } from '@/types/api.type';
import { postResource } from '@/lib/api-helpers';

const ForgetPasswordSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address' }),
});

export interface InitialForgetPasswordInState extends ApiResponse {
  errors?: Record<string, string[]>;
  values?: Record<string, unknown>;
  redirectTo?: string;
}

export async function forgotPassword(
  prevState: InitialForgetPasswordInState,
  formData: FormData
): Promise<InitialForgetPasswordInState> {
  const fields = Object.fromEntries(formData.entries());

  const validated = ForgetPasswordSchema.safeParse(fields);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      values: fields,
    };
  }

  const result = await postResource(
    '/auth/forgot-password',
    validated.data,
    'Unable to process your request',
    false
  );

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Invalid credentials',
      values: fields,
    };
  }

  const cookieStore = await cookies();

  cookieStore.set('email', validated.data.email, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return {
    success: true,
    message: result.message || 'Forgot password request successful',
  };
}
