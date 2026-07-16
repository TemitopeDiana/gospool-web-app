'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { PickupStop, DestinationStop } from '@/types/bus.type';
import { handleActionError } from '@/lib/utils';

export interface UpdateBusPayload {
  busType?: string;
  plateNumber?: string;
  year?: number;
  color?: string;
  availableSeats?: number;
  driverName?: string;
  driverPhoto?: string;
  isRoundTrip?: boolean;
  pickupLocations?: PickupStop[];
  pickupDate?: string;
  destinations?: DestinationStop[];
  departureLocations?: PickupStop[];
  departureDate?: string;
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
    const result = handleActionError(err);
    return {
      success: false,
      message:
        result.error || 'Failed to update bus profile. Please try again.',
    };
  }
}
