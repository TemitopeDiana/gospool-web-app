'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';

import { ApiResponse } from '@/types/api.type';
import { postResource } from '@/lib/api-helpers';
import { routes } from '@/lib/routes';
import { redirect } from 'next/navigation';

const ResetPasswordSchema = z
  .object({
    otp: z
      .string()
      .trim()
      .min(1, 'OTP is required')
      .length(6, 'OTP must be 6 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export interface InitialResetPasswordInState extends ApiResponse {
  errors?: Record<string, string[]>;
  values?: Record<string, unknown>;
  redirectTo?: string;
}

export async function resetPassword(
  prevState: InitialResetPasswordInState,
  formData: FormData
): Promise<InitialResetPasswordInState> {
  const fields = Object.fromEntries(formData.entries());

  const validated = ResetPasswordSchema.safeParse(fields);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      values: fields,
    };
  }

  const cookieStore = await cookies();
  const email = cookieStore.get('email')?.value;

  if (!email) {
    return {
      success: false,
      message: 'Your reset session has expired. Please request a new OTP.',
      values: fields,
    };
  }

  const { otp, password } = validated.data;

  const result = await postResource(
    '/auth/reset-password',
    {
      email,
      otp,
      password,
    },
    'Unable to process your request',
    false
  );

  if (!result.success) {
    return {
      success: false,
      message: result.message || 'Unable to reset password',
      values: fields,
    };
  }

  cookieStore.delete('email');

  redirect(routes.signIn());
}
