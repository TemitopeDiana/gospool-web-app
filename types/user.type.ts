import { Branch, Church } from './church.type';

export interface Department {
  _id: string;
  name: string;
  departmentId: string;
}

export type Role =
  | 'driver'
  | 'passenger'
  | 'churchAdmin'
  | 'branchLeader'
  | 'gospoolAdmin'
  | 'hod';

export enum RoleEnum {
  DRIVER = 'driver',
  PASSENGER = 'passenger',
  CHURCH_ADMIN = 'churchAdmin',
  GOSPOOL_ADMIN = 'gospoolAdmin',
  BRANCH_LEADER = 'branchLeader',
  HOD = 'hod',
}

export const RoleLabels: Record<RoleEnum, string> = {
  [RoleEnum.DRIVER]: 'Driver',
  [RoleEnum.PASSENGER]: 'Passenger',
  [RoleEnum.CHURCH_ADMIN]: 'Church Admin',
  [RoleEnum.GOSPOOL_ADMIN]: 'Super Admin',
  [RoleEnum.HOD]: 'H.O.D',
  [RoleEnum.BRANCH_LEADER]: 'Branch Leader',
};

export interface User {
  attendanceDuration: string;
  branch?: Pick<
    Branch,
    'name' | 'branchId' | 'branchIdentifier' | 'id' | '_id'
  >;
  church?: Pick<Church, 'name' | 'churchId' | 'uniqueIdentifier' | '_id'>;
  createdAt: string;
  dateOfBirth?: string;
  department?: Department;
  homeAddress: string;
  id: string;
  driverVerificationReturnTypes: Array<unknown>;
  firstName: string;
  lastName: string;
  gender?: 'male' | 'female';
  isActive: boolean;
  isDriverVerified: boolean;
  email: string;
  phoneNumber: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isVerified: boolean;
  isWorker: boolean;
  lastBranchSwitchAt: string;
  otp: string;
  roles: Role[];
  updatedAt: string;
  userId: string;
  otpExpires: string;
  _id: string;
}

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
