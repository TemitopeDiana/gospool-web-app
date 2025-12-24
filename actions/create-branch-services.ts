'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

interface CreateBranchServicesPayload {
  services: {
    name: string;
    day: string;
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
