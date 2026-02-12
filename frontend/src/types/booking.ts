export interface Booking {
  _id: string;
  user: string | {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  worker: string | {
    _id: string;
    userId: {
      name: string;
      phone: string;
    };
    profession: string;
    rating: number;
  };
  profession: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  status: 'pending' | 'accepted' | 'rejected' | 'started' | 'completed' | 'cancelled';
  otp: string;
  otpVerified: boolean;
  estimatedDistance: number;
  estimatedTime: number;
  pricing: number;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  timeline: {
    requested?: string;
    accepted?: string;
    started?: string;
    completed?: string;
  };
  rating?: number;
  feedback?: string;
  routeGeometry?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  workerId: string;
  profession: string;
  description?: string;
  location: {
    address?: string;
    coordinates: [number, number];
  };
}

export interface BookingRequest {
  bookingId: string;
  profession: string;
  distance: number;
  estimatedTime: number;
  userLocation: [number, number];
  pricing: number;
  timeout: number;
}

export interface BookingStats {
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  totalRevenue: number;
}
