/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Estimate travel time based on distance
 * Assumes average speed of 30 km/h in urban areas
 */
export const estimateTravelTime = (distanceKm: number): number => {
  const averageSpeed = 30; // km/h
  const timeInHours = distanceKm / averageSpeed;
  return Math.round(timeInHours * 60); // Convert to minutes
};

/**
 * Check if coordinates are within bounds
 */
export const isWithinBounds = (
  lat: number,
  lng: number,
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }
): boolean => {
  return (
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east
  );
};

/**
 * Get center point between two coordinates
 */
export const getCenterPoint = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { lat: number; lng: number } => {
  return {
    lat: (lat1 + lat2) / 2,
    lng: (lon1 + lon2) / 2,
  };
};

/**
 * Format coordinates to string
 */
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};
