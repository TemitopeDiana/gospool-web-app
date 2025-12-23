'use server';

import { AxiosError } from 'axios';
import { apiV1 } from '@/lib/api';
import { Filters } from '@/types/driver.type';
import { ApiResponse } from '@/types/api.type';
import Trip from '@/types/trip.type';

export const getRides = async (
  filters: Filters = {}
): Promise<ApiResponse<Trip[]>> => {
  try {
    const { page = 1, limit = 10, status = 'in-progress' } = filters;

    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (status) params.status = status;

    const response = await apiV1.get('/trip', {
      params,
    });

    return {
      success: true,
      data: response.data?.trips,
      pagination: response.data?.pagination,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data ?? { message: error.message },
      };
    }

    console.error('Unexpected error:', error);
    return {
      success: false,
      error: { message: 'Network or unexpected error' },
    };
  }
};
