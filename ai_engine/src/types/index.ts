export interface Location {
  latitude: number;
  longitude: number;
}

export interface Worker {
  _id: string;
  name: string;
  profession: string;
  experience: number;
  rating: number;
  totalRatings: number;
  location: Location;
  availability: boolean;
  skills: string[];
  completedJobs: number;
  address?: string;
  phone?: string;
  profileImage?: string;
}

export interface User {
  _id: string;
  name: string;
  location: Location;
  preferences?: {
    maxDistance?: number;
    minRating?: number;
    preferredProfessions?: string[];
  };
}

export interface MatchRequest {
  userId: string;
  userLocation: Location;
  serviceType: string;
  urgency?: 'low' | 'medium' | 'high';
  maxDistance?: number;
  minRating?: number;
  skills?: string[];
}

export interface MatchScore {
  workerId: string;
  score: number;
  breakdown: {
    distanceScore: number;
    ratingScore: number;
    experienceScore: number;
    availabilityScore: number;
    skillMatchScore: number;
    loadBalanceScore: number;
  };
  distance: number;
  estimatedTime: number;
}

export interface MatchResult {
  workers: Array<Worker & { matchScore: number; distance: number; estimatedTime: number }>;
  totalMatches: number;
  searchRadius: number;
  matchingAlgorithm: string;
}
