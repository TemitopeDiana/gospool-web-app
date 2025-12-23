'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { User } from '@/types/user.type';
import { AxiosError } from 'axios';

export const getChurchDrivers = async (
  churchId: string
): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiV1.get(
      `/user/?role=driver&church=${churchId}&page=1&limit=20`
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message ?? 'Failed to fetch passenger.',
      };
    }

    console.error('Get Church Passenger  error:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
