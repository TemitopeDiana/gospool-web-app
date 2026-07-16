'use server';

import { apiV1 } from '@/lib/api';
import { normalizeError } from '@/lib/normaliseError';
import { ApiResponse } from '@/types/api.type';
import { Branch } from '@/types/church.type';

export const getChurchBranches = async (
  churchId: string
): Promise<ApiResponse<Branch[]>> => {
  try {
    const res = await apiV1.get(`/branches?churchId=${churchId}`);

    return { success: true, data: res.data.data };
  } catch (error) {
    console.log('BRANCHES DATA:', error);

    return normalizeError(error);
  }
};
