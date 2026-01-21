'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { type Day } from '@/types/services.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

interface CreateBranchServicesPayload {
  name: string;
  day: Day;
  time: string;
}

export async function updateBranchServices(
  branchId: string,
  serviceId: string,
  formData: CreateBranchServicesPayload
) {
  try {
    const response = await apiV1.put(
      `/branches/${branchId}/services/${serviceId}`,
      { ...formData }
    );

    revalidatePath(routes.churches(), 'page');

    return {
      success: true,
      data: response.data,
      message: 'Services updated successfully',
    };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    console.log('Update Church branch services error', err);

    return {
      success: false,
      message: err.response?.data?.message ?? 'Failed to update services',
    };
  }
}
