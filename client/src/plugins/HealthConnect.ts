import { registerPlugin } from '@capacitor/core';

export interface HealthConnectPlugin {
  requestPermissions(): Promise<{ granted: boolean }>;
  getSteps(options: { startTime: number; endTime: number }): Promise<{ steps: number }>;
  getCalories(options: { startTime: number; endTime: number }): Promise<{ calories: number }>;
  getDistance(options: { startTime: number; endTime: number }): Promise<{ distance: number }>;
  getActiveMinutes(options: { startTime: number; endTime: number }): Promise<{ minutes: number }>;
  getHeartRate(options: { startTime: number; endTime: number }): Promise<{ heartRate: number }>;
  isAvailable(): Promise<{ available: boolean }>;
}

const HealthConnect = registerPlugin<HealthConnectPlugin>('HealthConnect', {
  web: () => ({
    requestPermissions: async () => ({ granted: false }),
    getSteps: async () => ({ steps: 0 }),
    getCalories: async () => ({ calories: 0 }),
    getDistance: async () => ({ distance: 0 }),
    getActiveMinutes: async () => ({ minutes: 0 }),
    getHeartRate: async () => ({ heartRate: 0 }),
    isAvailable: async () => ({ available: false }),
  }),
});

export default HealthConnect;
