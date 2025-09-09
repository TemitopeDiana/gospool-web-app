export interface UserProfile {
  _id: string;
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  roles: Role[];
  createdBy: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  otp: string;
  otpExpires: string;
  __v: number;
}

export type Role = 'driver' | 'passenger' | 'churchAdmin';

export enum RoleEnum {
  DRIVER = 'driver',
  PASSENGER = 'passenger',
  CHURCH_ADMIN = 'churchAdmin',
}

export const RoleLabels: Record<RoleEnum, string> = {
  [RoleEnum.DRIVER]: 'Driver',
  [RoleEnum.PASSENGER]: 'Passenger',
  [RoleEnum.CHURCH_ADMIN]: 'Church Admin',
};
