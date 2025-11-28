'use server';

import { apiV1 } from '@/lib/api';
import { RevalidateTags } from '@/lib/constants';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';
import { revalidateTag } from 'next/cache';

export async function toggleChurchBranchStatus(
  branchId: string,
  isActive: boolean
): Promise<ApiResponse> {
  try {
    const res = await apiV1.put(`/branches/${branchId}`, { isActive });

    console.log({ isActive });

    revalidateTag(RevalidateTags.GET_CHURCH_BRANCHES);

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
