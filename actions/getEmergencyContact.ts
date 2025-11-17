'use server';

import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';

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

    if (
      response?.data &&
      response.data.success &&
      Array.isArray(response.data.data)
    ) {
      return { success: true, data: response.data.data };
    }

    return { success: false, error: response.data ?? 'Unexpected response' };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data ?? error.message,
      };
    }

    console.error('Unexpected error in getEmergencyContacts:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
