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
  };
  leader: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  status: string;
  statusDisplay: string;
  formattedDate: string;
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
}

export type ChurchStatus = 'active' | 'inactive' | 'suspended' | string;
