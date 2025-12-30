export type Day =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface ChurchService {
  serviceId: string;
  name: string;
  day: Day;
  time: '8:00am';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChurchBranchServicesResponse {
  branchId: string;
  branchName: string;
  services: ChurchService[];
}
