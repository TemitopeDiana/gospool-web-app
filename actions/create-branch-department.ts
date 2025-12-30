'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

interface CreateBranchDepartmentPayload {
  name: string;
  branchId: string;
  description?: string;
  hodId?: string;
}

export async function createBranchDepartment(
  formData: CreateBranchDepartmentPayload
) {
  try {
    const response = await apiV1.post(`/departments`, formData);

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Department created successfully',
    };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    console.log('Create Church branch department error', err);

    return {
      success: false,
      message:
        (err.response?.data?.message || err.response?.data?.error) ??
        'Failed to create department',
    };
  }
}
