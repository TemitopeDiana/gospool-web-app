'use server';

import { apiV1 } from '@/lib/api';
import { handleActionError } from '@/lib/utils';
import { Bus, BusFilters } from '@/types/bus.type';
import { Pagination } from '@/types/church.type';

export interface GetBusesResponse {
  success: true;
  data: Bus[];
  pagination: Pagination;
}

export const getBuses = async (
  filters: BusFilters = {}
): Promise<GetBusesResponse | { success: false; error: unknown; authRequired?: boolean }> => {
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
      params: { church, branch, isActive, isPublic, search, page, limit },
    });

    return response.data;
  } catch (error: unknown) {
    return handleActionError(error);
  }
};
