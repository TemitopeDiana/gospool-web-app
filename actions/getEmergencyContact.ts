'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { normalizeError } from '@/lib/normaliseError';

export interface EmergencyContact {
  contactId: string;
  fullName: string;
  relationship: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export type EmergencyContactsResult =
  | EmergencyContact[]
  | { success: false; error: unknown };

export const getEmergencyContact = async (
  userId: string
): Promise<ApiResponse<EmergencyContact[]>> => {
  try {
    const response = await apiV1.get<{
      success: boolean;
      data: EmergencyContact[];
    }>('/user/admin/emergency-contacts', { params: { userId } });

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Unexpected error in getEmergencyContacts:', error);
    return normalizeError(error);
  }
};
