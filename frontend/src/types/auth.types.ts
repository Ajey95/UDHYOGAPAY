export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'worker';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: 'user' | 'worker' | 'admin';
    avatar?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'worker' | 'admin';
  avatar?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export interface OTPVerification {
  phone: string;
  otp: string;
}

export interface PasswordReset {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}
