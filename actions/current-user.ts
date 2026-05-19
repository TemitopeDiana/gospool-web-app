'use server';

import { apiV1 } from '@/lib/api';
import { handleActionError } from '@/lib/utils';
import { UserProfile } from '@/types/user.type';

export const currentUser = async (): Promise<{
  success: boolean;
  user?: UserProfile;
  error?: string;
  authRequired?: boolean;
}> => {
  try {
    const response = await apiV1.get<{ user: UserProfile }>('/user/me');
    return { success: true, user: response.data.user };
  } catch (error: unknown) {
    return handleActionError(error);
  }
};
