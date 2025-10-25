import { APIErrorPayload } from './api.type';
import { Pagination } from './church.type';

export interface DriverDocumentFile {
  fileUrl?: string;
  issuanceDate?: string;
  expiryDate?: string;
}

export interface VehicleDocuments {
  driverLicense?: DriverDocumentFile;
  roadWorthiness?: DriverDocumentFile;
  carInsurance?: DriverDocumentFile;
  carInfo?: DriverDocumentFile;
  certificateOfOwnership?: DriverDocumentFile;
}

export interface Vehicle {
  vehicleId: string;
  plateNumber?: string;
  carModel?: string;
  year?: number;
  color?: string;
  isOwner: boolean;
  clearanceToDrive?: boolean;
  status?: string;
  documents?: VehicleDocuments;
  createdAt?: string;
}

export interface DriverDocuments {
  driversLicense?: DriverDocumentFile;
  carInfo?: {
    plateNumber?: string;
    carModel?: string;
    year?: number;
    carColor?: string;
    isOwner: boolean;
    clearanceToDrive: boolean;
  };
  carIssuance?: DriverDocumentFile;
  certificateOfOwnership?: DriverDocumentFile;
  roadWorthiness?: DriverDocumentFile;
  [key: string]: DriverDocumentFile | object | undefined;
}

export interface DriverChecklist {
  carInfo?: boolean;
  driversLicense?: boolean;
  carIssuance?: boolean;
  certificateOfOwnership?: boolean;
  roadWorthiness?: boolean;
  allComplete?: boolean;
  [key: string]: boolean | undefined;
}

export interface ChurchRef {
  id?: string;
  name?: string;
  address?: string;
  [key: string]: unknown;
}

export interface BranchRef {
  id?: string;
  name?: string;
  address?: string;
  [key: string]: unknown;
}

export interface DepartmentRef {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface VerifierRef {
  userId?: string;
  name?: string;
  email?: string;
}

export interface Driver {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth: string;
  gender: string;
  homeAddress: string;
  avatar: string;
  attendanceDuration?: string;
  preferredServiceTime?: string;
  roles?: string[];
  isActive?: boolean;
  driverVerificationStatus?: string;
  isDriverVerified?: boolean;
  driverDocuments?: DriverDocuments;
  driverChecklist?: DriverChecklist;
  driverVerificationReason?: string;
  driverVerifiedAt?: string;
  driverRequestedAt?: string;
  churchName?: string;
  branchName?: string;
  departmentName?: string;
  church: {
    id: string;
    name: string;
    address: string;
  };
  branch: {
    id: string;
    name: string;
    address: string;
  };
  department: {
    id: string;
    name: string;
  };
  verifier: {
    userId: string;
    name: string;
    email: string;
  };
  vehicles?: Vehicle[];
  statusDisplay?: string;
  createdAt?: string;
  updatedAt?: string;
  experienceDisplay?: string;
  carDisplay?: string;
  plateDisplay?: string;
  formattedUpdatedAt?: string;
}
export interface DriverAPIResponse<T> {
  success: boolean;
  data?: T;
  pagination?: Pagination;
  error?: APIErrorPayload;
}

export interface DriversFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export type DriverAction = 'approve' | 'reject' | 'return';

export interface VerifyDriverAPIResponse {
  success: boolean;
  error: string;
  stack: string;
}
