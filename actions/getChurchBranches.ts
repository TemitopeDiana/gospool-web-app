'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Branch } from '@/types/church.type';
import { AxiosError } from 'axios';

export const getChurchBranches = async (): Promise<ApiResponse<Branch[]>> => {
  try {
    const res = await apiV1.get('/branches');

    return { success: true, data: res.data.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data?.message ?? 'Request failed',
      };
    }

    return { success: false, error: 'Network or unexpected error' };
  }
};
