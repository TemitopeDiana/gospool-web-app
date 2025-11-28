'use server';

import { apiV1 } from '@/lib/api';
import { ApiResponse } from '@/types/api.type';
import { AxiosError } from 'axios';

type Branch = {
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  _id: string;
  churchId: {
    name: string;
    churchId?: string;
  };
  name: string;
  address: string;
  leaderId: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  branchIdentifier: string;
  fullIdentifier: string;
  identifierEdited: boolean;
  isActive: boolean;
  branchId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

interface ChurchBranchResponse {
  success: boolean;
  data: Branch;
}

export const getChurchBranchById = async (
  branchId: string
): Promise<ApiResponse<Branch>> => {
  try {
    const response = await apiV1.get<ChurchBranchResponse>(
      `/branches/${branchId}`
    );

    return { success: true, data: response.data.data };
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error('Unexpected error:', error);
      return {
        success: false,
        error: error.response?.data,
      };
    }

    console.error('Unexpected error:', error);
    return { success: false, error: 'Network or unexpected error' };
  }
};
