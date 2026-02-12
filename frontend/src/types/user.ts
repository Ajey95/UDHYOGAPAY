export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'worker' | 'admin';
  location?: {
    type: string;
    coordinates: [number, number];
  };
  isVerified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  avatar?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
  favoriteWorkers?: string[];
  bookingHistory?: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'worker';
}
