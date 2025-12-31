'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { ChurchBranchServicesResponse } from '@/types/services.type';
import { AxiosError } from 'axios';

export const getChurchBranchServices = async (
  branchId: string
): Promise<ApiResponse<ChurchBranchServicesResponse>> => {
  try {
    const response = await apiV1.get(`/branches/${branchId}/services`);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    console.log('Get Church branch services error', err);

    return {
      success: false,
      message: err.response?.data?.message ?? 'Failed to get services',
    };
  }
};
