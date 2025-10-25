'use server';

import { AxiosError } from 'axios';
import { apiV1 } from '@/lib/api';
import { DriverAction, VerifyDriverAPIResponse } from '@/types/driver.type';

export const verifyDriver = async (
  userId: string,
  action: DriverAction,
  reason?: string
): Promise<VerifyDriverAPIResponse | { success: false; error: unknown }> => {
  try {
    const body = { action, reason };
    const response = await apiV1.patch(`/drivers/${userId}/verify`, body);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data,
      };
    }
    return { success: false, error: 'Network or unexpected error' };
  }
};
