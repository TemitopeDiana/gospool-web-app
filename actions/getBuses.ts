'use server';

import { apiV1 } from '@/lib/api';
import { Bus, BusFilters } from '@/types/bus.type';
import { Pagination } from '@/types/church.type';
import { AxiosError } from 'axios';

export interface GetBusesResponse {
  success: true;
  data: Bus[];
  pagination: Pagination;
}

export const getBuses = async (
  filters: BusFilters = {}
): Promise<GetBusesResponse | { success: false; error: unknown }> => {
  try {
    const {
      church,
      branch,
      isActive,
      isPublic,
      search,
      page = 1,
      limit = 50,
    } = filters;

    const response = await apiV1.get<GetBusesResponse>('/bus', {
      params: {
        church,
        branch,
        isActive,
        isPublic,
        search,
        page,
        limit,
      },
    });

    return response.data;
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
