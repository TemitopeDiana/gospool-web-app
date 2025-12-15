'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Stats } from '@/types/stats.type';
import { AxiosError } from 'axios';

export const getChurchStats = async (
  churchId: string
): Promise<ApiResponse<Stats>> => {
  try {
    const response = await apiV1.get(`/churches/${churchId}/member-stats`);

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
