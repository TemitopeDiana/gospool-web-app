'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

export async function toggleChurchBranchStatus(
  branchId: string,
  isActive: boolean
): Promise<ApiResponse> {
  try {
    const res = await apiV1.put(`/branches/${branchId}`, { isActive });

    console.log({ isActive });

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
