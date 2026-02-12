import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Worker } from '../../types/worker';
import { WORKER_MARKER_COLORS } from '../../utils/constants';

// Fix default marker icons issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Map controls component
const MapControls: React.FC = () => {
  const map = useMap();

  const handleLocate = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
        title="Zoom In"
      >
        ➕
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
        title="Zoom Out"
      >
        ➖
      </button>
      <button
        onClick={handleLocate}
        className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
        title="My Location"
      >
        📍
      </button>
    </div>
  );
};

// User location icon
const userLocationIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Worker icon generator
const getWorkerIcon = (profession: string) => {
  const color = WORKER_MARKER_COLORS[profession] || 'grey';

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

interface LeafletMapProps {
  center: [number, number];
  zoom?: number;
  workers?: Worker[];
  onWorkerClick?: (worker: Worker) => void;
  userLocation?: [number, number];
  routeCoordinates?: [number, number][];
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center,
  zoom = 13,
  workers = [],
  onWorkerClick,
  userLocation,
  routeCoordinates,
  height = '100vh'
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height, width: '100%' }}
      zoomControl={false}
      className="z-0"
    >
      {/* OpenStreetMap Tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User Location Marker */}
      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-bold">Your Location</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Worker Markers */}
      {workers.map((worker) => {
        const coords = worker.currentLocation.coordinates;
        const position: [number, number] = [coords[1], coords[0]]; // Swap lon/lat to lat/lon

        return (
          <Marker
            key={worker._id}
            position={position}
            icon={getWorkerIcon(worker.profession)}
            eventHandlers={{
              click: () => onWorkerClick && onWorkerClick(worker)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-lg">
                  {worker.userDetails?.name || worker.userId.name}
                </h3>
                <p className="text-sm text-gray-600 capitalize">{worker.profession}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{worker.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({worker.totalJobs} jobs)</span>
                </div>
                {worker.exactDistance && (
                  <p className="text-sm mt-1">
                    📍 {worker.exactDistance} km away
                  </p>
                )}
                {worker.estimatedTime && (
                  <p className="text-sm">
                    ⏱️ ~{worker.estimatedTime} mins
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Experience: {worker.experience} years
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Route Polyline */}
      {routeCoordinates && (
        <Polyline
          positions={routeCoordinates}
          color="#3b82f6"
          weight={4}
          opacity={0.7}
        />
      )}

      <MapControls />
    </MapContainer>
  );
};
