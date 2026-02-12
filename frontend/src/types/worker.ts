export interface Worker {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  profession: 'plumber' | 'electrician' | 'carpenter' | 'painter' | 'cleaner';
  experience: number;
  isVerified: boolean;
  isOnline: boolean;
  documents: {
    aadhar?: {
      url: string;
      uploadedAt: string;
    };
    policeVerification?: {
      url: string;
      uploadedAt: string;
    };
  };
  rating: number;
  totalJobs: number;
  totalReviews: number;
  hourlyRate: number;
  currentLocation: {
    type: string;
    coordinates: [number, number];
    lastUpdated: string;
  };
  location: {
    type: string;
    coordinates: [number, number];
  };
  availability: boolean | {
    status: 'available' | 'busy' | 'offline';
    updatedAt: string;
  };
  userDetails?: {
    name: string;
    phone: string;
  };
  distance?: number;
  estimatedTime?: number;
  exactDistance?: string;
  routeGeometry?: any;
  finalScore?: number;
}

export interface WorkerProfile {
  _id: string;
  userId: string;
  profession: string;
  experience: number;
  rating: number;
  totalJobs: number;
  totalReviews: number;
  hourlyRate: number;
  isVerified: boolean;
  isOnline: boolean;
  availability: boolean;
}

export interface WorkerStats {
  totalEarnings: number;
  totalJobs: number;
  completedJobs: number;
  pendingJobs: number;
  rating: number;
  totalReviews: number;
}

export interface WorkerKYC {
  profession: 'plumber' | 'electrician' | 'carpenter' | 'painter' | 'cleaner';
  experience: number;
  aadhar: File | null;
  policeVerification: File | null;
}
