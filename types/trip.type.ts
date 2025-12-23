import { Driver, Vehicle } from './driver.type';

export type DriverInfo = Pick<
  Driver,
  'userId' | 'firstName' | 'lastName' | 'email' | 'phoneNumber'
>;

export interface Passenger {
  type: string;
  passengerId: string;
  status: string;
  pickupLocation: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: string;
  passenger: {
    firstName: string;
    lastName: string;
    avatar: string;
    email: string;
    phoneNumber: string;
  };
  passengersCount: 0;
}

export default interface Trip {
  tripId: string;
  driverId: string;
  vehicleId?: string;
  vehicle?: Vehicle;
  churchId: string;
  branchId: string;
  bookingId?: string;
  rideRequestId?: string;
  eventType: 'service' | 'program' | 'other';
  eventDate: Date;
  departureTime: Date;
  serviceTime: string;
  startLocation: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  destination: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  availableSeats: number;
  preferredGender: 'male' | 'female' | 'any';
  routeInfo?: {
    routeName: string;
    travelTime: number;
    departureTime: Date;
    arrivalTime: Date;
  };
  uniquePassengers: 0;
  confirmedPassengers: 0;
  totalPassengers: 0;
  passengers: Passenger[];

  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'active';
  createdAt: Date;
  updatedAt: Date;
  driver: DriverInfo;
  branch: {
    name: string;
    address: string;
  };
}
export interface RideHistoryResponse {
  trips: Trip[];
  pagination: {
    currentPage: string;
    totalPages: number;
    totalTrips: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
