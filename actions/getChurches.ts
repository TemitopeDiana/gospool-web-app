'use server';

import { apiV1 } from '@/lib/api';
import { handleActionError } from '@/lib/utils';
import { ChurchResponse } from '@/types/church.type';

export interface ChurchFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const getChurches = async (
  filters: ChurchFilters = {}
): Promise<
  ChurchResponse | { success: false; error: unknown; authRequired?: boolean }
> => {
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
    return handleActionError(error);
  }
};
