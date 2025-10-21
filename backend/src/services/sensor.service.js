const { SensorModel } = require("../models/sensor.model.js");
const {
  SensorReadingTypeModel,
} = require("../models/sensor-reading-type.model.js");
const {
  SensorSupportedTypeModel,
} = require("../models/sensor-supported-type.model.js");
const { SensorReadingModel } = require("../models/sensor-reading.model.js");
const {
  sensorSchemaId,
  sensorSupportedTypeSchema,
  SensorReadingTypeSchema,
  SensorReadingTypeSchemaWithoutId,
  attachingSensorsToNodeSchema,
  getReadingsBySensorIdAndType,
} = require("../validators/sensor.validator.js");

/**
 * Servicio para la gestión de sensores y sus tipos.
 *
 * Este servicio permite crear, obtener, actualizar y eliminar sensores y tipos de sensores,
 * centralizando la lógica de negocio relacionada a estos componentes.
 */
class SensorService {
  /**
   * Crea un nuevo sensor con los datos proporcionados.
   *
   * @param {Object} sensorData - Datos del sensor (nombre, ubicación, estado, etc.).
   * @returns {Promise<Object>} Sensor creado exitosamente.
   * @throws {Error} Si ocurre un error al crear el sensor.
   */
  static async createSensor(name, status, typeIds) {
    try {
      const { value, error } = sensorSupportedTypeSchema.validate(
        { name, status, typeIds },
        { convert: true },
      );

      if (error) throw new Error(`Datos inválidos: ${error.message}`);

      const existingSensor = await SensorModel.getSensorByName(value.name);
      if (existingSensor) {
        throw new Error(`El sensor con el nombre ${value.name} ya existe`);
      }

      const newSensor = await SensorModel.createSensor(
        value.name,
        null, // nodeId is set to null by default
        value.status,
      );

      await Promise.all(
        value.typeIds && Array.isArray(value.typeIds)
          ? value.typeIds.map((typeId) =>
              SensorSupportedTypeModel.createSensorSupportedType({
                sensor_id: newSensor.id,
                type_id: typeId,
              }),
            )
          : [],
      );

      return newSensor;
    } catch (error) {
      throw new Error(`Error al crear el sensor: ${error.message}`);
    }
  }

  /**
   * Obtiene un sensor por su ID.
   *
   * @param {number|string} id - ID del sensor a buscar.
   * @returns {Promise<Object>} Sensor encontrado.
   * @throws {Error} Si ocurre un error durante la búsqueda.
   */
  static async getSensorById(id) {
    try {
      const { value, error } = sensorSchemaId.validate(
        { id },
        { convert: true },
      );
      if (error) throw new Error(`ID inválido: ${error.message}`);

      const sensor = await SensorModel.getSensorById(value.id);

      if (!sensor) return null;

      const sensorDto = {
        id: sensor.id,
        name: sensor.name,
        nodeId: sensor.node_id,
        status: sensor.status,
        types: sensor.supported_types.map((supportedType) => ({
          id: supportedType.id,
          name: supportedType.type.name,
          unit: supportedType.type.unit,
          description: supportedType.type.description || "No disponible",
        })),
        node: sensor.nodes
          ? {
              id: sensor.nodes.id,
              name: sensor.nodes.name,
            }
          : null,
      };

      return sensorDto;
    } catch (error) {
      throw new Error(`Error fetching sensor by ID: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los sensores registrados.
   *
   * @returns {Promise<Array<Object>>} Lista de sensores.
   * @throws {Error} Si ocurre un error al obtener los sensores.
   */
  static async getAllSensors() {
    try {
      const sensors = await SensorModel.getAllSensors();
      return sensors.map((sensor) => {
        return {
          id: sensor.id,
          name: sensor.name,
          nodeId: sensor.node_id,
          status: sensor.status,
        };
      });
    } catch (error) {
      throw new Error(`Error fetching all sensors: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los sensores asociados a un nodo específico.
   * @param {number|string} nodeId - ID del nodo cuyas sensores se desean obtener.
   * @returns {Promise<Array<Object>>} Lista de sensores asociados al nodo.
   * @throws {Error} Si ocurre un error al obtener los sensores.
   */
  static async getSensorsByNodeId(nodeId) {
    try {
      const { value, error } = sensorSchemaId.validate(
        { id: nodeId },
        { convert: true },
      );
      if (error) throw new Error(`ID inválido: ${error.message}`);

      return await SensorModel.getSensorsByNodeId(value.id);
    } catch (error) {
      throw new Error(`Error fetching sensors by node ID: ${error.message}`);
    }
  }

  /**
   * Actualiza un sensor existente con nuevos datos.
   *
   * @param {number|string} id - ID del sensor a actualizar.
   * @param {Object} sensorData - Nuevos datos para el sensor.
   * @returns {Promise<Object>} Sensor actualizado.
   * @throws {Error} Si ocurre un error durante la actualización.
   */
  static async updateSensor(id, sensorData) {
    try {
      return await SensorModel.updateSensor(id, sensorData);
    } catch (error) {
      throw new Error(`Error updating sensor: ${error.message}`);
    }
  }

  /**
   * Asocia una lista de sensores a un nodo específico.
   *
   * @param {number|string} idNode - ID del nodo al que se asociarán los sensores.
   * @param {Array<number|string>} sensorIds - Lista de IDs de sensores a asociar al nodo.
   * @returns {Promise<Array<Object>>} Sensores actualizados.
   * @throws {Error} Si ocurre un error durante la asociación.
   */
  static async attachSensorsToNode(idNode, sensorIds) {
    try {
      const { value, error } = attachingSensorsToNodeSchema.validate(
        { idNode, sensorIds },
        { convert: true },
      );
      if (error) throw new Error(`Datos inválidos: ${error.message}`);

      return await SensorModel.updateSensorsForNode(
        value.idNode,
        value.sensorIds,
      );
    } catch (error) {
      throw new Error(`Error attaching sensors for node: ${error.message}`);
    }
  }

  /**
   * Elimina un sensor por su ID.
   *
   * @param {number|string} id - ID del sensor a eliminar.
   * @returns {Promise<Object>} Resultado de la operación.
   * @throws {Error} Si ocurre un error al eliminar el sensor.
   */
  static async deleteSensor(id) {
    try {
      const { value, error } = sensorSchemaId.validate(
        { id },
        { convert: true },
      );
      if (error) throw new Error(`ID inválido: ${error.message}`);
      return await SensorModel.deleteSensor(value.id);
    } catch (error) {
      throw new Error(`Error deleting sensor: ${error.message}`);
    }
  }

  // ────────────────────────────────────────────────────────────────

  /**
   * Crea un nuevo tipo de sensor.
   *
   * @param {string} name - Nombre del tipo de sensor.
   * @param {string} unit - Unidad de medida del tipo de sensor.
   * @param {string} description - Descripción del tipo de sensor.
   * @returns {Promise<Object>} Tipo de sensor creado.
   * @throws {Error} Si ocurre un error al crear el tipo de sensor.
   */
  static async createSensorType(name, unit, description) {
    try {
      console.log("Creating sensor type with data:", {
        name,
        unit,
        description,
      });
      const { value, error } = SensorReadingTypeSchemaWithoutId.validate(
        { name, unit, description },
        { convert: true },
      );

      if (error) throw new Error(`Datos inválidos: ${error.message}`);

      return await SensorReadingTypeModel.createSensorReadingType(
        value.name,
        value.unit,
        value.description,
      );
    } catch (error) {
      throw new Error(`Error creating sensor type: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los tipos de sensores registrados.
   *
   * @returns {Promise<Array<Object>>} Lista de tipos de sensores.
   * @throws {Error} Si ocurre un error al obtener los tipos de sensores.
   */
  static async getAllSensorTypes() {
    try {
      return await SensorReadingTypeModel.getAllSensorReadingTypes();
    } catch (error) {
      throw new Error(`Error fetching all sensor types: ${error.message}`);
    }
  }

  /**
   * Obtiene los tipos de sensor asociados a un sensor específico por su ID.
   *
   * @param {number|string} sensorId - ID del sensor cuyas tipos se desean obtener.
   * @returns {Promise<Array<Object>>} Lista de tipos de sensor asociados al sensor.
   * @throws {Error} Si ocurre un error al obtener los tipos de sensor.
   */
  static async getSensorTypeBySensorId(sensorId) {
    try {
      const { value, error } = sensorSchemaId.validate(
        { id: sensorId },
        { convert: true },
      );
      if (error) throw new Error(`Invalid sensor ID: ${error.message}`);
      const supportedTypes =
        await SensorSupportedTypeModel.getSensorSupportedTypeBySensorId(
          value.id,
        );
      const sensorTypes = supportedTypes.map((type) => type.type);
      return sensorTypes;
    } catch (error) {
      throw new Error(
        `Error fetching sensor type by sensor ID: ${error.message}`,
      );
    }
  }

  /**
   * Actualiza un tipo de sensor existente.
   *
   * @param {number|string} id - ID del tipo de sensor a actualizar.
   * @param {Object} sensorTypeData - Nuevos datos del tipo de sensor.
   * @returns {Promise<Object>} Tipo de sensor actualizado.
   * @throws {Error} Si ocurre un error durante la actualización.
   */
  static async updateSensorType(id, sensorTypeData) {
    try {
      return await SensorReadingTypeModel.updateSensorReadingType(
        id,
        sensorTypeData,
      );
    } catch (error) {
      throw new Error(`Error updating sensor type: ${error.message}`);
    }
  }

  /**
   * Elimina un tipo de sensor por su ID.
   *
   * @param {number|string} id - ID del tipo de sensor a eliminar.
   * @returns {Promise<Object>} Resultado de la operación.
   * @throws {Error} Si ocurre un error al eliminar el tipo de sensor.
   */
  static async deleteSensorType(id) {
    try {
      return await SensorReadingTypeModel.deleteSensorReadingType(id);
    } catch (error) {
      throw new Error(`Error deleting sensor type: ${error.message}`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  static async createSensorSupportedType(sensorSupportedTypeData) {
    try {
      return await SensorSupportedTypeModel.createSensorSupportedType(
        sensorSupportedTypeData,
      );
    } catch (error) {
      throw new Error(`Error creating sensor supported type: ${error.message}`);
    }
  }

  static async getAllSensorSupportedTypes() {
    try {
      return await SensorSupportedTypeModel.getAllSensorSupportedTypes();
    } catch (error) {
      throw new Error(
        `Error fetching all sensor supported types: ${error.message}`,
      );
    }
  }

  static async updateSensorSupportedType(id, sensorSupportedTypeData) {
    try {
      return await SensorSupportedTypeModel.updateSensorSupportedType(
        id,
        sensorSupportedTypeData,
      );
    } catch (error) {
      throw new Error(`Error updating sensor supported type: ${error.message}`);
    }
  }

  static async deleteSensorSupportedType(id) {
    try {
      return await SensorSupportedTypeModel.deleteSensorSupportedType(id);
    } catch (error) {
      throw new Error(`Error deleting sensor supported type: ${error.message}`);
    }
  }

  // ────────────────────────────────────────────────────────────────
  /**
   * Obtiene las lecturas de un tipo de sensor por su ID.
   *
   * @param {number|string} sensorTypeId - ID del tipo de sensor cuyas lecturas se desean obtener.
   * @returns {Promise<Array<Object>>} Lista de lecturas del tipo de sensor.
   * @throws {Error} Si ocurre un error al obtener las lecturas.
   */
  static async getReadingsBySensorTypeId(sensorTypeId) {
    try {
      const { value, error } = sensorSchemaId.validate(
        { id: sensorTypeId },
        { convert: true },
      );
      if (error) throw new Error(`Invalid sensor type ID: ${error.message}`);
      return await SensorReadingModel.getReadingsBySensorTypeId(value.id);
    } catch (error) {
      throw new Error(
        `Error fetching readings by sensor type ID: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene las lecturas de un sensor específico por su ID y tipo.
   *
   * @param {number|string} sensorId - ID del sensor cuyas lecturas se desean obtener.
   * @param {number|string} typeId - ID del tipo de sensor cuyas lecturas se desean obtener.
   * @returns {Promise<Array<Object>>} Lista de lecturas del sensor y tipo especificados.
   * @throws {Error} Si ocurre un error al obtener las lecturas.
   */
  static async getReadingsBySensorIdAndType(sensorId, typeId) {
    try {
      const { value, error } = getReadingsBySensorIdAndType.validate(
        { idSensor: sensorId, idType: typeId },
        { convert: true },
      );
      if (error)
        throw new Error(`Invalid sensor ID or type ID: ${error.message}`);
      return SensorReadingModel.getReadingsBySensorIdAndType(
        value.idSensor,
        value.idType,
      );
    } catch (error) {
      throw new Error(
        `Error fetching readings by sensor ID and type: ${error.message}`,
      );
    }
  }
}
module.exports = { SensorService };
