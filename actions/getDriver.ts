'use server';
import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { Driver, DriverAPIResponse } from '@/types/driver.type';

export const getDriver = async (
  driverId: string
): Promise<DriverAPIResponse<Driver>> => {
  try {
    const response = await apiV1.get<DriverAPIResponse<Driver>>(
      `/drivers/${driverId}`
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data,
      };
    }

    console.error('Unexpected error:', error);
    return {
      success: false,
      error: { message: 'Network or unexpected error' },
    };
  }
};
