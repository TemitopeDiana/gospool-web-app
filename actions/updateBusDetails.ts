'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

export interface UpdateBusPayload {
  name?: string;
  busType?: string;
  plateNumber?: string;
  year?: number;
  color?: string;
  availableSeats?: number;
  driverName?: string;
  driverPhoto?: string;
  pickupLocation?: string;
  destination?: string;
  departureTime?: string;
  isPublic?: boolean;
  isActive?: boolean;
  branchId?: string;
}

export async function updateBusDetails(
  busId: string,
  payload: UpdateBusPayload
): Promise<ApiResponse> {
  try {
    const res = await apiV1.put(`/bus/${busId}`, payload);

    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'Bus updated successfully',
    };
  } catch (err) {
    const axiosError = err as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to update bus profile. Please try again.',
    };
  }
}
