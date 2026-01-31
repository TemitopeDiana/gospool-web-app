'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { Bus } from '@/types/bus.type';
import { AxiosError } from 'axios';

export interface CreateBusPayload {
  busType: string;
  year: number;
  availableSeats: number;
  plateNumber: string;
  color: string;
  name: string;
  churchId: string;
  branchId: string;
}

export const createBusProfile = async (
  payload: CreateBusPayload
): Promise<ApiResponse<Bus>> => {
  try {
    const response = await apiV1.post<Bus>('/bus', payload);

    return {
      success: true,
      data: response.data,
    };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data ?? 'Failed to create bus',
      };
    }

    console.error('Unexpected error creating bus:', error);
    return {
      success: false,
      error: 'Network or unexpected error',
    };
  }
};
