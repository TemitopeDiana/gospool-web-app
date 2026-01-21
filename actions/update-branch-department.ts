'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

interface UpdateBranchDepartmentPayload {
  name: string;
  description?: string;
  departmentId: string;
}

export async function updateBranchDepartment(
  formData: UpdateBranchDepartmentPayload
) {
  try {
    const { departmentId, ...rest } = formData;
    const response = await apiV1.put(`/departments/${departmentId}`, {
      ...rest,
    });

    revalidatePath(routes.churches(), 'page');

    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Department updated successfully',
    };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;

    console.log('Update Church branch department error', err);

    return {
      success: false,
      message:
        (err.response?.data?.message || err.response?.data?.error) ??
        'Failed to update department',
    };
  }
}
