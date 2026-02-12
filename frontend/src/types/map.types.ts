export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapConfig {
  center: MapPosition;
  zoom: number;
  minZoom: number;
  maxZoom: number;
}

export interface MarkerData {
  id: string;
  position: MapPosition;
  type: 'user' | 'worker';
  data: any;
}

export interface RouteData {
  coordinates: MapPosition[];
  distance: number; // meters
  duration: number; // seconds
}

export interface MapFilters {
  profession?: string;
  maxDistance?: number;
  minRating?: number;
  availability?: boolean;
}
