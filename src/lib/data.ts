import { type DetectionEvent } from './types';

export const detectionHistory: DetectionEvent[] = [
  {
    eventId: 'evt_1',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    confidence: 0.92,
    cameraId: 'CAM-01',
    callStatus: 'completed',
  },
  {
    eventId: 'evt_2',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    confidence: 0.88,
    cameraId: 'CAM-02',
    callStatus: 'completed',
  },
  {
    eventId: 'evt_3',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    confidence: 0.95,
    cameraId: 'CAM-01',
    callStatus: 'failed',
  },
  {
    eventId: 'evt_4',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    confidence: 0.81,
    cameraId: 'CAM-03',
    callStatus: 'completed',
  },
  {
    eventId: 'evt_5',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    confidence: 0.99,
    cameraId: 'CAM-01',
    callStatus: 'completed',
  },
  {
    eventId: 'evt_6',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    confidence: 0.85,
    cameraId: 'CAM-02',
    callStatus: 'initiated',
  },
  {
    eventId: 'evt_7',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    confidence: 0.91,
    cameraId: 'CAM-03',
    callStatus: 'completed',
  },
  {
    eventId: 'evt_8',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    confidence: 0.79,
    cameraId: 'CAM-01',
    callStatus: 'failed',
  },
];
