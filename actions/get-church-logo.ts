'use server';

import { apiV1 } from '@/lib/api';

export const getChurchLogo = async (
  churchId: string
): Promise<{ logoUrl: string }> => {
  try {
    const response = await apiV1.get(`/churches/${churchId}/logo`);

    return { logoUrl: response.data.data.logoUrl };
  } catch (error: unknown) {
    console.error('Unexpected error:', error);
    return { logoUrl: '' };
  }
};
