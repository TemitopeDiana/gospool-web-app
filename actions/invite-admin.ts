'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

interface InviteAdminPayload {
  churchId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export async function inviteAdmin(formData: InviteAdminPayload) {
  try {
    const { churchId, ...rest } = formData;
    const response = await apiV1.post(`/churches/${churchId}/invite-admin`, {
      ...rest,
    });

    revalidatePath(routes.churches(), 'page');

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Admin invited successfully',
    };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    console.log('Invite Admin error', err);

    return {
      success: false,
      message:
        (err.response?.data?.message || err.response?.data?.error) ??
        'Failed to invite admin',
    };
  }
}
