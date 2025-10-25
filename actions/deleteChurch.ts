// actions/delete-church.ts
'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export type DeleteChurchResult = {
  success: boolean;
  message?: string;
};

export async function deleteChurchAction(
  churchId: string
): Promise<DeleteChurchResult> {
  if (!churchId) {
    return { success: false, message: 'Invalid church ID' };
  }

  try {
    const res = await apiV1.delete(`/churches/${churchId}`);

    revalidatePath(routes.home());

    return {
      success: res.data?.success ?? false,
      message: res.data?.message || 'Church deleted successfully',
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to delete church. Please try again.',
    };
  }
}
