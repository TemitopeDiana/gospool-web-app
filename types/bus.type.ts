export interface Bus {
  busId: string;
  name: string;
  busType: string;
  plateNumber: string;
  year: number;
  color: string;
  availableSeats: number;
  driverName?: string;
  driverPhoto?: string;
  pickupLocation?: string;
  departureTime?: string;
  isPublic: boolean;
  isActive: boolean;
  churchId: string;
  branchId: string;
  createdBy: string;
  bookedSeats: number;
  remainingSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface BusFilters {
  church?: string;
  branch?: string;
  isActive?: boolean;
  isPublic?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}
