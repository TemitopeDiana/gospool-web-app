'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

export interface MakeBusPublicPayload {
  driverPhoto?: string;
  driverName: string;
  pickupLocation: string;
  destination: string;
  departureTime: string;
}

export async function toggleBusPresence(
  busId: string,
  payload: MakeBusPublicPayload
): Promise<ApiResponse> {
  try {
    const res = await apiV1.patch(`/bus/${busId}/make-public`, payload);

    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'Bus is now public',
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to make bus public. Please try again.',
    };
  }
}
