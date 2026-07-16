'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

interface AssignChurchToAdminPayload {
  adminId: string;
  churchId: string;
}

export async function assignChurchToAdmin(
  formData: AssignChurchToAdminPayload
) {
  try {
    const { churchId, ...rest } = formData;
    const response = await apiV1.put(`/churches/${churchId}/assign-admin`, {
      ...rest,
    });

    revalidatePath(routes.churches(), 'page');

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Church assigned to admin successfully',
    };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    console.log('Assign Church to Admin error', err);

    return {
      success: false,
      message:
        (err.response?.data?.message || err.response?.data?.error) ??
        'Failed to assign church to admin',
    };
  }
}
