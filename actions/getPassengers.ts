'use server';

import { AxiosError } from 'axios';
import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { User } from '@/types/user.type';

export const getPassengers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiV1.get(`/user/?role=passenger&page=1&limit=20`);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message ?? 'Failed to fetch passengers.',
      };
    }

    console.error('Get Passengers  error:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
