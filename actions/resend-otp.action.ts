'use server';

import { postResource } from '@/lib/api-helpers';
import type { ApiResponse } from '@/types/api.type';

type ResendOtpPurpose = 'verification' | 'password_reset' | 'login';

type ResendOtpPayload =
  | {
      email: string;
      phoneNumber?: never;
      purpose: ResendOtpPurpose;
    }
  | {
      phoneNumber: string;
      email?: never;
      purpose: ResendOtpPurpose;
    };

export type ResendOtpResponse = {
  expiresIn?: number;
};

export async function resendOtp(
  payload: ResendOtpPayload
): Promise<ApiResponse<ResendOtpResponse>> {
  return postResource<ResendOtpResponse>(
    '/auth/resend-otp',
    payload,
    'Unable to resend OTP',
    false
  );
}
