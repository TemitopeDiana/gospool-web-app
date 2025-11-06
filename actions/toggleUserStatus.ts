'use server';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';

export async function toggleUserStatus(userId: string): Promise<ApiResponse> {
  if (!userId) {
    return { success: false, message: 'Invalid user ID' };
  }

  try {
    const res = await apiV1.patch(`/user/${userId}/status`);

    revalidatePath(routes.drivers());
    revalidatePath(routes.driverProfile(userId));

    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'User status updated successfully',
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to update user status. Please try again.',
    };
  }
}
