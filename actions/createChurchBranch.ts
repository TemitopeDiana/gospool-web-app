'use server';

import { apiV1 } from '@/lib/api';
import { routes } from '@/lib/routes';
import { ChurchBranchArgs } from '@/types/church.type';
import { AxiosError } from 'axios';
import { revalidatePath } from 'next/cache';

export type CreateChurchBranchResponse = {
  success: boolean;
  message?: string;
};

export async function createChurchBranch(
  data: ChurchBranchArgs
): Promise<CreateChurchBranchResponse> {
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
    const axiosError = err as AxiosError<{ message?: string; error?: string }>;

    console.log('BRANCH NOT CREATED', err);

    return {
      success: false,
      message:
        axiosError.response?.data?.error ||
        'Something went wrong. Please try again.',
    };
  }
}
