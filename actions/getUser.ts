'use server';
import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { User } from '@/types/user.type';
import { ApiResponse } from '@/types/api.type';

export const getUser = async (userId: string): Promise<ApiResponse<User>> => {
  try {
    const response = await apiV1.get<ApiResponse<User>>(`/user/${userId}`);

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
