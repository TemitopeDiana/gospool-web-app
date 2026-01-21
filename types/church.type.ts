export interface Branch {
  branchId: string;
  churchId: string;
  name: string;
  address: string;
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  leaderId: string;
  branchIdentifier: string;
  fullIdentifier: string;
  identifierEdited: boolean;
  isActive: boolean;
  church: {
    name: string;
    churchId?: string;
  };
  leader: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
  };
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  status: string;
  statusDisplay: string;
  formattedDate: string;
  id: string;
  _id: string;
}

export interface ChurchResponse {
  success: boolean;
  data: Church[];
  pagination: Pagination;
}

export interface Church {
  isActive: boolean;
  _id: string;
  name: string;
  uniqueIdentifier: string;
  totalBranches: number;
  adminId: Admin;
  identifierEdited: boolean;
  churchId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  logo: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminAvatar?: string;
  status: ChurchStatus;
  statusDisplay: string;
}

export interface Admin {
  _id: string;
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
  current?: 1;
}

export type ChurchStatus = 'active' | 'inactive' | 'suspended' | string;

export interface Department {
  _id: string;
  branchId: string;
  name: string;
  description: string;
  isDeleted: boolean;
  departmentId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  branch: Branch;
  hod: null;
}

export interface ChurchBranchArgs {
  churchId: string;
  name: string;
  address: string;
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  leaderName: string;
  leaderEmail: string;
  leaderPhoneNumber: string;
  branchIdentifier?: string;
}
