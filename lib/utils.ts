import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AxiosError } from 'axios';
import { AuthRequiredError } from '@/lib/errors';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ActionErrorResult {
  success: false;
  error: string;
  authRequired?: boolean;
}

/**
 * Shared error handler for server actions that use apiV1.
 * Catches AuthRequiredError (thrown by the request interceptor when the
 * session is expired/missing) and AxiosError, returning a typed failure
 * object instead of letting the error bubble up as an unhandled exception.
 */
export function handleActionError(error: unknown): ActionErrorResult {
  if (error instanceof AuthRequiredError) {
    return { success: false, error: 'AUTH_REQUIRED', authRequired: true };
  }

  if (error instanceof AxiosError) {
    if (error.response?.status === 401) {
      return { success: false, error: 'AUTH_REQUIRED', authRequired: true };
    }
    return {
      success: false,
      error: error.response?.data?.message ?? error.message ?? 'Request failed',
    };
  }

  console.error('Unexpected action error:', error);
  return { success: false, error: 'Network or unexpected error' };
}
