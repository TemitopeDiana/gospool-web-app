'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { OverallStats } from '@/types/stats.type';
import { AxiosError } from 'axios';

export const getOverallStats = async (): Promise<ApiResponse<OverallStats>> => {
  try {
    const response = await apiV1.get(`/user/dashboard/stats`);

    return { success: true, data: response.data.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data,
      };
    }

    console.error('Unexpected error:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
