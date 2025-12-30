'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { type Day } from '@/types/services.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

interface CreateBranchServicesPayload {
  services: {
    name: string;
    day: Day;
    time: string;
  }[];
}

export async function createBranchServices(
  branchId: string,
  formData: CreateBranchServicesPayload
) {
  try {
    const response = await apiV1.post(
      `/branches/${branchId}/services/bulk`,
      formData
    );

    revalidatePath(routes.churches(), 'page');

    return {
      success: true,
      data: response.data,
      message: 'Services created successfully',
    };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    console.log('Create Church branch services error', err);

    return {
      success: false,
      message: err.response?.data?.message ?? 'Failed to create services',
    };
  }
}
