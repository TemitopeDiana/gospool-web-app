'use server';
import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { Driver, DriverAPIResponse, DriversFilters } from '@/types/driver.type';

export const getDrivers = async (
  filters: DriversFilters = {}
): Promise<DriverAPIResponse<Driver[]>> => {
  try {
    const { page = 1, limit = 10, search, status = 'pending' } = filters;

    const params: Record<string, string | number> = {
      page,
      limit,
    };

    if (status) params.status = status;
    if (typeof search === 'string' && search.trim().length > 0) {
      params.search = search.trim();
    }

    const response = await apiV1.get<DriverAPIResponse<Driver[]>>('/drivers', {
      params,
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
    return {
      success: false,
      error: { message: 'Network or unexpected error' },
    };
  }
};
