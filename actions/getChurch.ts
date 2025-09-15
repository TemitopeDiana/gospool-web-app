'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Church } from '@/types/church.type';
import { AxiosError } from 'axios';

interface ChurchApiResponse {
  success: boolean;
  data: Church;
}

export const getChurch = async (
  identifier: string
): Promise<ApiResponse<Church>> => {
  try {
    const response = await apiV1.get<ChurchApiResponse>(
      `/churches/identifier/${identifier}`
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
