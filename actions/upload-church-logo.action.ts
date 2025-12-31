'use server';

import { apiV1 } from '@/lib/api';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.type';
import { revalidatePath } from 'next/cache';
import { routes } from '@/lib/routes';

export interface UploadLogoArgs {
  logo: File | null;
}

export async function uploadChurchLogo(
  churchId: string,
  data: UploadLogoArgs
): Promise<ApiResponse> {
  try {
    if (!data.logo) {
      return {
        success: false,
        message: 'Please select a logo to upload',
      };
    }

    const formData = new FormData();

    formData.append('logo', data.logo);

    const res = await apiV1.post(`/churches/${churchId}/logo`, formData);

    revalidatePath(routes.churchProfile(churchId));

    console.log('Logo upload', res);

    return {
      success: true,
      message: res.data?.message || 'Church logo uploaded successfully',
      data: res.data,
    };
  } catch (err) {
    const axiosErr = err as AxiosError<{
      message?: string;
      error?: string;
    }>;

    console.error('Upload Church Logo Error:', axiosErr.response?.data);

    return {
      success: false,
      message:
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        'Failed to upload church logo',
      error: axiosErr.message,
    };
  }
}
