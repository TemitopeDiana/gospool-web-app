'use server';

import { AxiosError } from 'axios';
import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Passenger } from '@/types/passenger.type';

export const getChurchPassengers = async (
  churchId: string
): Promise<ApiResponse<Passenger[]>> => {
  try {
    const response = await apiV1.get(
      `/user/?role=passenger&church=${churchId}&page=1&limit=20`
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
