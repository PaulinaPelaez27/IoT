import { Node } from './node';
import { Threshold } from './threshold';

// Interfaz que representa un sensor, extendiendo de SensorCreate.
// Incluye un identificador único y una referencia opcional al nodo al que está conectado.
export interface Sensor extends SensorCreate {
  id: number;
  node?: Node | null; // Objeto nodo opcional, puede ser null si no está conectado
}

// Interfaz para la creación de un sensor.
// Incluye nombre, ID de nodo opcional, estado, umbrales, IDs de tipos y objetos de tipo de sensor.
export interface SensorCreate {
  name: string;
  nodeId?: number | null; // ID del nodo al que está conectado el sensor, puede ser null si no está conectado
  status?: string;
  thresholds?: Threshold[]; // Lista de umbrales asociados al sensor
  typeIds?: number[]; // Arreglo de IDs de tipos de sensor
  types?: SensorType[]; // Objeto(s) opcional(es) de tipo de sensor
}

// Interfaz que representa el tipo de sensor, incluyendo nombre, descripción y unidad de medida.
// Extiende de SensorTypeCreate y agrega un identificador único.
export interface SensorType extends SensorTypeCreate {
  id: number;
}

// Interfaz para la creación de un tipo de sensor.
// Incluye nombre, descripción opcional y unidad de medida.
export interface SensorTypeCreate {
  name: string;
  description?: string;
  unit: string;
}
