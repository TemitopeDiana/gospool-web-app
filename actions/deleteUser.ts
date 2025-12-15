// actions/delete-church.ts
'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

export async function deleteUser(userId: string): Promise<ApiResponse> {
  try {
    const res = await apiV1.delete(`/user/${userId}`);

    return {
      success: res.data?.success ?? false,
      message: res.data?.message || 'User deleted successfully',
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to delete user. Please try again.',
    };
  }
}
