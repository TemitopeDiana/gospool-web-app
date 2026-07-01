'use server';

import { apiV1 } from '@/lib/api';
import { normalizeError } from '@/lib/normaliseError';
import { routes } from '@/lib/routes';
import { ApiResponse } from '@/types/api.type';
import { ChurchBranchArgs } from '@/types/church.type';
import { revalidatePath } from 'next/cache';

export async function createChurchBranch(
  data: ChurchBranchArgs
): Promise<ApiResponse> {
  const payload: ChurchBranchArgs = {
    ...data,
    branchIdentifier: data.branchIdentifier || undefined,
  };
  try {
    const res = await apiV1.post(`/branches/with-leader`, payload);

    revalidatePath(routes.churchProfile(data.churchId));

    return {
      success: res.data?.success,
      message: res.data?.message || 'Branch created successfully',
    };
  } catch (err) {
    console.log('BRANCH NOT CREATED', err);

    return normalizeError(err);
  }
}
