export type DetectionEvent = {
  eventId: string;
  timestamp: Date;
  confidence: number;
  cameraId: string;
  callStatus: 'initiated' | 'completed' | 'failed';
};
