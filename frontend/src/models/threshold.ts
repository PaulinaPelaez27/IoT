import { Sensor } from './sensor';

export interface Threshold {
  id: number;
  sensorId: number;
  typeId: number;
  type?: string;
  minValue: number;
  maxValue: number;
  sensor: Sensor;
}
