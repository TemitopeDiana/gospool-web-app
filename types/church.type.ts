export interface Church {
  churchId?: string;
  name: string;
  uniqueIdentifier: string;
  totalBranches: number;
  logo?: string;
  adminId?: string;
  identifierEdited?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Branch {
  date: string;
  name: string;
  status?: string;
  avatar?: string;
  email?: string;
  department?: string;
}
