'use server';

import { apiV1 } from '@/lib/api';
import { UserProfile } from '@/types/user.type';
import { AxiosError } from 'axios';

export const currentUser = async (): Promise<{
  success: boolean;
  user?: UserProfile;
  error?: string;
}> => {
  try {
    const response = await apiV1.get<{ user: UserProfile }>('/user/me');

    return { success: true, user: response.data.user };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message ?? 'Request failed',
      };
    }

    console.error('Unexpected error:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
