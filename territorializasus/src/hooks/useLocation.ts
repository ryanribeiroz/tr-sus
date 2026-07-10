// src/hooks/useLocation.ts
import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import type { LocationData } from '@/types';

export function useLocation() {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    accuracy: null,
    capturedAt: null,
    locationStatus: 'not_requested',
  });
  const [isCapturing, setIsCapturing] = useState(false);

  const captureLocation = useCallback(async (): Promise<LocationData> => {
    setIsCapturing(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        const result: LocationData = {
          latitude: null,
          longitude: null,
          accuracy: null,
          capturedAt: null,
          locationStatus: 'permission_denied',
        };
        setLocation(result);
        setIsCapturing(false);
        return result;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const result: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        capturedAt: Date.now(),
        locationStatus: 'captured',
      };
      setLocation(result);
      setIsCapturing(false);
      return result;
    } catch {
      const result: LocationData = {
        latitude: null,
        longitude: null,
        accuracy: null,
        capturedAt: null,
        locationStatus: 'unavailable',
      };
      setLocation(result);
      setIsCapturing(false);
      return result;
    }
  }, []);

  return { location, isCapturing, captureLocation };
}
