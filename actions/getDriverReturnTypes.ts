'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

interface DriverReturnTypesApiResponse {
  success: boolean;
  data: string[];
}

export const getDriverReturnTypes = async (): Promise<
  ApiResponse<string[]>
> => {
  try {
    const response = await apiV1.get<DriverReturnTypesApiResponse>(
      `/drivers/return-types`
    );

    return { success: true, data: response.data.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data,
      };
    }

    console.error('Unexpected error:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
