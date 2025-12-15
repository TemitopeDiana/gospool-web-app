'use server';

import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { User } from '@/types/user.type';

export const getChurchBranchPassengers = async (
  branchId: string
): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiV1.get(
      `/user/?role=passenger&branch=${branchId}&page=1&limit=20`
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error:
          error.response?.data?.message ??
          'Failed to fetch church branch drivers.',
      };
    }

    console.error('Get church branch drivers  error:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
