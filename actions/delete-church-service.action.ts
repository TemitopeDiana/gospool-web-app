'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export async function deleteChurchService(
  branchId: string,
  serviceId: string
): Promise<ApiResponse> {
  try {
    const res = await apiV1.delete(
      `/branches/${branchId}/services/${serviceId}`
    );

    revalidatePath(routes.churches(), 'page');

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
