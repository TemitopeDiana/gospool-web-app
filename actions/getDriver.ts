'use server';
import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { Driver } from '@/types/driver.type';
import { ApiResponse } from '@/types/api.type';

export const getDriver = async (
  driverId: string
): Promise<ApiResponse<Driver>> => {
  try {
    const response = await apiV1.get<ApiResponse<Driver>>(
      `/drivers/${driverId}`
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data,
      };
    }

    console.error('Unexpected error:', error);
    return {
      success: false,
      error: { message: 'Network or unexpected error' },
    };
  }
};
