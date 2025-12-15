'use server';

import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Branch } from '@/types/church.type';

export const getChurchBranchById = async (
  branchId: string
): Promise<ApiResponse<Branch>> => {
  try {
    const response = await apiV1.get<ApiResponse<Branch>>(
      `/branches/${branchId}`
    );

    return { success: true, data: response.data.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Unexpected error:', error);
      return {
        success: false,
        error: error.response?.data,
      };
    }

    console.error('Unexpected error:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
