'use server';

import { apiV1 } from '@/lib/api';
import type { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';

export interface CreateChurchArgs {
  name: string;
  logo: string | undefined;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhoneNumber: string;
}

export const createChurchAction = async (
  data: CreateChurchArgs
): Promise<ApiResponse> => {
  try {
    await apiV1.post('/churches/with-admin', data);

    revalidatePath(routes.home());
    return { success: true, message: 'Church created successfully' };
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string; error: string }>;

    console.log('CHURCH NOT CREATED', err);

    return {
      success: false,
      message:
        axiosErr.response?.data?.error ||
        'Failed to create church, please try again',
      error: axiosErr.response?.data.error,
    };
  }
};
