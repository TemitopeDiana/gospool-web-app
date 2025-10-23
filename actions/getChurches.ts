'use server';

import { apiV1 } from '@/lib/api';
import { ChurchResponse } from '@/types/church.type';
import { AxiosError } from 'axios';

export interface ChurchFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getChurches = async (
  filters: ChurchFilters = {}
): Promise<ChurchResponse | { success: false; error: unknown }> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const response = await apiV1.get<ChurchResponse>('/churches', {
      params: { page, limit, sortBy, sortOrder },
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
