'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export async function deleteBus(busId: string) {
  try {
    const res = await apiV1.delete(`/bus/${busId}`);

    revalidatePath(routes.bus(), 'page');

    return {
      success: res.data?.success ?? false,
      message: res.data?.message || 'Bus removed successfully',
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to remove bus. Please try again.',
    };
  }
}
