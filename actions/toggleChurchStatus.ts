// actions/delete-church.ts
'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export async function toggleChurchStatus(
  churchId: string
): Promise<ApiResponse> {
  if (!churchId) {
    return { success: false, message: 'Invalid church ID' };
  }

  try {
    const res = await apiV1.patch(`/churches/${churchId}/toggle-status`);

    revalidatePath(routes.home());

    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'Church status updated successfully',
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to update church status. Please try again.',
    };
  }
}
