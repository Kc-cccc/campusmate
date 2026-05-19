import { useEffect, useState } from 'react';
import * as Battery from 'expo-battery';
import { Accelerometer } from 'expo-sensors';
import type { DeviceContextSummary } from '../types/models';

function batteryStateToText(state: Battery.BatteryState): string {
  switch (state) {
    case Battery.BatteryState.CHARGING:
      return 'Charging';
    case Battery.BatteryState.FULL:
      return 'Full';
    case Battery.BatteryState.UNPLUGGED:
      return 'Unplugged';
    default:
      return 'Unknown';
  }
}

export function useDeviceContext(): DeviceContextSummary {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [batteryState, setBatteryState] = useState('Unknown');
  const [motionStatus, setMotionStatus] = useState<DeviceContextSummary['motionStatus']>('unknown');

  useEffect(() => {
    let active = true;
    void Battery.getBatteryLevelAsync().then((level) => {
      if (active) setBatteryLevel(Math.round(level * 100));
    });
    void Battery.getBatteryStateAsync().then((state) => {
      if (active) setBatteryState(batteryStateToText(state));
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    Accelerometer.setUpdateInterval(900);
    const subscription = Accelerometer.addListener((reading) => {
      const magnitude = Math.sqrt(reading.x ** 2 + reading.y ** 2 + reading.z ** 2);
      setMotionStatus(magnitude > 1.18 ? 'moving' : 'still');
    });
    return () => subscription.remove();
  }, []);

  return { batteryLevel, batteryState, motionStatus };
}
