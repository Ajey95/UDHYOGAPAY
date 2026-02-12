export interface SocketEvents {
  // Worker events
  'worker:location': {
    workerId: string;
    location: {
      coordinates: [number, number];
    };
  };
  'worker:availability': {
    workerId: string;
    available: boolean;
  };

  // Booking events
  'booking:created': any;
  'booking:updated': any;
  'booking:confirmed': any;
  'booking:rejected': any;
  'booking:cancelled': any;
  'booking:worker_en_route': any;
  'booking:in_progress': any;
  'booking:completed': any;

  // Notification events
  'notification:new': {
    id: string;
    type: string;
    title: string;
    message: string;
    data?: any;
    createdAt: string;
  };
}

export type SocketEventName = keyof SocketEvents;
