'use server';
import { AxiosError } from 'axios';

import { apiV1 } from '@/lib/api';
import { TeamMember, User } from '@/types/user.type';
import { ApiResponse } from '@/types/api.type';

export const getUsers = async (role: string): Promise<ApiResponse<User[]>> => {
  try {
    const response = await apiV1.get<ApiResponse<User[]>>(`/user?role=${role}`);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data,
      };
    }

    console.error('Unexpected error:', error);
    return {
      success: false,
      error: { message: 'Network or unexpected error' },
    };
  }
};

export const getTeamMembers = async (
  branchId: string
): Promise<ApiResponse<TeamMember[]>> => {
  try {
    const response = await apiV1.get<ApiResponse<TeamMember[]>>(
      `/user/team-members?branch=${branchId}`
    );

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        error: error.response?.data,
      };
    }

    console.error('Unexpected error:', error);
    return {
      success: false,
      error: { message: 'Network or unexpected error' },
    };
  }
};
