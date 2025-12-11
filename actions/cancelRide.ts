'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

interface CancelTripPayload {
  tripId: string;
}

interface TripStatusUpdate {
  tripId: string;
  status: string;
  eventDate: string;
}

interface CancelTripApiResponse {
  message: string;
  trip: TripStatusUpdate;
}

export const cancelTrip = async (
  payload: CancelTripPayload
): Promise<ApiResponse<{ message: string; trip: TripStatusUpdate }>> => {
  try {
    const response = await apiV1.put<CancelTripApiResponse>(
      `/trips/${payload.tripId}/status`,
      {
        status: 'cancelled',
      }
    );

    return {
      success: true,
      data: {
        message: response.data.message,
        trip: response.data.trip,
      },
    };
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
