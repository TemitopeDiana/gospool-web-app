'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Branch } from '@/types/church.type';
import { AxiosError } from 'axios';

export const getChurchBranches = async (
  churchId: string
): Promise<ApiResponse<Branch[]>> => {
  try {
    const res = await apiV1.get(`/branches?churchId=${churchId}`);

    return { success: true, data: res.data.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.log('BRANCHES DATA:', error);

      return {
        success: false,
        error: error.response?.data?.message ?? 'Request failed',
      };
    }

    return { success: false, error: 'Network or unexpected error' };
  }
};
