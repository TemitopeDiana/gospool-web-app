// actions/delete-church.ts
'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export async function deleteChurchBranch(
  branchId: string,
  churchId: string
): Promise<ApiResponse> {
  try {
    const res = await apiV1.delete(`/branches/${branchId}`);

    revalidatePath(routes.churchProfile(churchId));

    return {
      success: res.data?.success ?? false,
      message: res.data?.message || 'Branch deleted successfully',
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to delete church branch. Please try again.',
    };
  }
}
