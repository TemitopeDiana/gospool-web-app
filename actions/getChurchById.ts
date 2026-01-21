'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Church } from '@/types/church.type';
import { AxiosError } from 'axios';

interface ChurchApiResponse {
  success: boolean;
  data: Church;
}

export const getChurchById = async (
  churchId: string
): Promise<ApiResponse<Church>> => {
  try {
    const response = await apiV1.get<ChurchApiResponse>(
      `/churches/${churchId}`
    );

    return { success: true, data: response.data.data };
  } catch (error) {
    const err = error as AxiosError<ApiResponse>;
    console.error('Unexpected error:', error);
    return {
      ...err,
      success: false,
    };
  }
};
