import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import {
  Sensor,
  SensorCreate,
  SensorType,
  SensorTypeCreate,
} from '../models/sensor';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SensorService {
  constructor(private gService: GeneralService) {}

  getSensorsWithoutNode(): Promise<Sensor[]> {
    return Promise.resolve([]);
  }

  getSensors(): Observable<Sensor[]> {
    return this.gService.getData('sensors');
  }

  getSensorById(id: number): Observable<Sensor> {
    return this.gService.getData(`sensors/${id}`);
  }

  getSensorsByNodeId(nodeId: number): Observable<Sensor[]> {
    return this.gService.getData(`sensors/node/${nodeId}`);
  }

  createSensor(sensor: SensorCreate): Observable<Sensor> {
    return this.gService.postData('sensors', sensor);
  }

  attachSensorsToNode(nodeId: number, sensors: Sensor[]): Observable<Sensor[]> {
    const sensorIds = sensors
      .map((sensor) => sensor.id)
      .filter((id): id is number => typeof id === 'number');
    return this.gService.putData(`sensors/attach/node`, {
      idNode: nodeId,
      sensorIds,
    });
  }

  deleteSensor(id: number): Observable<void> {
    return this.gService.deleteData(`sensors/${id}`);
  }

  // -- sensor types
  getSensorsTypes(): Observable<SensorType[]> {
    return this.gService.getData('sensors/types');
  }

  getSensorTypeBySensorId(sensorId: number): Observable<SensorType[]> {
    return this.gService.getData(`sensors/types/${sensorId}`);
  }

  createSensorType(type: SensorTypeCreate): Observable<SensorType> {
    return this.gService.postData('sensors/types', type);
  }
}
