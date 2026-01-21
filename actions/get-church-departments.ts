'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Department } from '@/types/church.type';
import { AxiosError } from 'axios';

export const getChurchBranchDepartments = async (
  branchId: string
): Promise<ApiResponse<Department[]>> => {
  try {
    const response = await apiV1.get(`/departments?branch=${branchId}`);

    console.log('departments', { response });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    console.log('Get Church branch departments error', err);

    return {
      success: false,
      message: err.response?.data?.message ?? 'Failed to get departments',
    };
  }
};
