// actions/delete-church.ts
'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export async function deleteUser(userId: string): Promise<ApiResponse> {
  try {
    const res = await apiV1.delete(`/user/${userId}`);

    revalidatePath(routes.churches(), 'page');
    revalidatePath(routes.passengers(), 'page');
    revalidatePath(routes.drivers(), 'page');

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
