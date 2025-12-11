'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { HodsAdminUser } from '@/types/user.type';
import { AxiosError } from 'axios';

interface SearchHodsAdminsApiResponse {
  success: boolean;
  data: HodsAdminUser[];
}

export const getHodsAdmins = async (
  query: string,
  limit: number = 20
): Promise<ApiResponse<HodsAdminUser[]>> => {
  try {
    const response = await apiV1.get<SearchHodsAdminsApiResponse>(
      `/user/search/hods-admins`,
      {
        params: {
          search: query.trim(),
          limit,
        },
      }
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
