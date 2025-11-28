'use server';

import { apiV1 } from '@/lib/api';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '@/types/api.type';

export type UploadedFileRes = {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
};

export async function uploadFile(
  file: File
): Promise<ApiResponse<UploadedFileRes>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiV1.post('/upload/file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return res;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string; error: string }>;
    console.error('Upload Error:', err);

    return {
      success: false,
      message:
        axiosErr.response?.data?.error ||
        'Failed to upload file, please try again',
      error: axiosErr.response?.data?.error,
    };
  }
}
