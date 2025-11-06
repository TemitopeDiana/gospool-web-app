'use server';

import { AxiosError } from 'axios';
import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { revalidatePath } from 'next/cache';
import { routes } from '@/lib/routes';

type VerifyDriverParams =
  | {
      userId: string;
      action: 'approve';
      reason?: never;
      types?: string[];
    }
  | {
      userId: string;
      action: 'reject';
      reason: string;
      types?: string[];
    }
  | {
      userId: string;
      action: 'return';
      reason: string;
      types?: string[];
    };

export const verifyDriver = async (
  params: VerifyDriverParams
): Promise<ApiResponse | { success: false; error: string }> => {
  const { userId, action, reason, types } = params;
  try {
    const body = { action, reason, types };
    const res = await apiV1.patch(`/drivers/${userId}/verify`, body);

    revalidatePath(routes.drivers());
    revalidatePath(routes.driverProfile(params.userId));

    return {
      success: res.data.success ?? true,
      message: res.data?.message ?? 'Driver verification updated successfully',
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message?: string }>;

    return {
      success: false,
      message:
        axiosError.response?.data?.message ||
        'Failed to verify driver status. Please try again.',
    };
  }
};
