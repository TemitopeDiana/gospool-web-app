export interface BusPassengers {
  busBookingId: string;
  passengerId: string;
  name: string;
  email: string;
  photo: string;
  dateBooked: string;
  travelDate: string;
  seatsBooked: number;
  status: string;
  isBoarded: boolean;
  boardedAt: string;
}

export interface PickupStop {
  label: string;
  time?: string;
}

export interface DestinationStop {
  label: string;
}

export interface Bus {
  busId: string;
  busType: string;
  plateNumber: string;
  year: number;
  color: string;
  availableSeats: number;
  driverName?: string;
  driverPhoto?: string;
  /** @deprecated use pickupLocations */
  pickupLocation?: string;
  pickupLocations: PickupStop[];
  destinations: DestinationStop[];
  departureLocations: PickupStop[];
  pickupDate?: string;
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
  passengers: BusPassengers[];
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
