'use server';

import { revalidatePath } from 'next/cache';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { normalizeError } from '@/lib/normaliseError';

export async function toggleChurchStatus(
  churchId: string
): Promise<ApiResponse> {
  if (!churchId) {
    return { success: false, message: 'Invalid church ID' };
  }

  try {
    const res = await apiV1.patch(`/churches/${churchId}/toggle-status`);

    revalidatePath(routes.branches());

    return {
      success: res.data?.success ?? true,
      message: res.data?.message || 'Church status updated successfully',
    };
  } catch (err) {
    console.log('TOGGLE CHURCH STATUS ERROR', err);
    return normalizeError(err);
  }
}
