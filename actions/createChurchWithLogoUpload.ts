'use server';

import { apiV1 } from '@/lib/api';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.type';
import { revalidatePath } from 'next/cache';
import { routes } from '@/lib/routes';

export interface CreateChurchArgs {
  name: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPhoneNumber: string;
  logo?: File | null;
}

export async function createChurchWithUpload(
  data: CreateChurchArgs
): Promise<ApiResponse> {
  try {
    let logoUrl = '';

    if (data.logo) {
      const formData = new FormData();
      formData.append('file', data.logo);

      const uploadRes = await apiV1.post('/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (!uploadRes?.data?.data?.fileUrl) {
        throw new Error('Failed to upload church logo');
      }

      logoUrl = uploadRes.data.data.fileUrl;
    }

    const payload = {
      ...data,
      churchLogo: undefined,
      logo: logoUrl,
    };
    console.log(payload);

    await apiV1.post('/churches/with-admin', payload);

    revalidatePath(routes.home());

    return { success: true, message: 'Church created successfully' };
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string; error?: string }>;
    console.error('Upload + Create Error:', err);

    return {
      success: false,
      message:
        axiosErr.response?.data?.message ||
        axiosErr.response?.data?.error ||
        'An unexpected error occurred',
      error: axiosErr.message,
    };
  }
}
