'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { PickupStop, DestinationStop } from '@/types/bus.type';
import { handleActionError } from '@/lib/utils';

export interface MakeBusPublicPayload {
  driverPhoto?: string;
  driverName: string;
  isRoundTrip?: boolean;
  pickupLocations: PickupStop[];
  pickupDate?: string;
  destinations: DestinationStop[];
  departureLocations?: PickupStop[];
  departureDate?: string;
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
    const result = handleActionError(err);
    return {
      success: false,
      message: result.error || 'Failed to make bus public. Please try again.',
    };
  }
}
