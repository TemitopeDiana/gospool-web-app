'use server';

import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { RideHistoryResponse } from '@/types/trip.type';

export interface RideHistoryFilters {
  driverId: string;
  page?: number;
  limit?: number;
}

export const getRideHistory = async (
  filters: RideHistoryFilters
): Promise<RideHistoryResponse> => {
  try {
    const { driverId, page = 1, limit = 10 } = filters;

    const response = await apiV1.get<RideHistoryResponse>(
      '/trip/ride-history',
      {
        params: { driverId, page, limit },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API Error in getRideHistory:', error.response?.data);
      throw new Error('Failed to fetch ride history data.');
    }

    console.error('Unexpected error:', error);
    throw new Error('Network or unexpected error occurred.');
  }
};
