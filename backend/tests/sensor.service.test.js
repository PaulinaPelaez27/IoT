const { SensorService } = require("../src/services/sensor.service");
const { SensorModel } = require("../src/models/sensor.model");
const {
  SensorReadingTypeModel,
} = require("../src/models/sensor-reading-type.model");
const {
  SensorSupportedTypeModel,
} = require("../src/models/sensor-supported-type.model");
const { SensorReadingModel } = require("../src/models/sensor-reading.model");

jest.mock("../src/models/sensor.model");
jest.mock("../src/models/sensor-reading-type.model");
jest.mock("../src/models/sensor-supported-type.model");
jest.mock("../src/models/sensor-reading.model");

describe("SensorService", () => {
  describe("createSensor", () => {
    it("should create a new sensor successfully", async () => {
      const mockSensor = {
        id: 1,
        name: "Temperature Sensor",
        status: "maintainance",
      };
      SensorModel.getSensorByName.mockResolvedValue(null);
      SensorModel.createSensor.mockResolvedValue(mockSensor);
      SensorSupportedTypeModel.createSensorSupportedType.mockResolvedValue({});

      const result = await SensorService.createSensor(
        "Temperature Sensor",
        "MAINTENANCE",
        [1],
      );

      expect(result).toEqual(mockSensor);
      expect(SensorModel.getSensorByName).toHaveBeenCalledWith(
        "Temperature Sensor",
      );
      expect(SensorModel.createSensor).toHaveBeenCalled();
    });

    it("should throw an error if sensor already exists", async () => {
      SensorModel.getSensorByName.mockResolvedValue({ id: 1 });

      await expect(
        SensorService.createSensor("Temperature Sensor", "MAINTENANCE", [1]),
      ).rejects.toThrow(
        "Error al crear el sensor: El sensor con el nombre Temperature Sensor ya existe",
      );
    });

    it("should throw an error if validation fails", async () => {
      await expect(
        SensorService.createSensor("", "MAINTENANCE", [1]),
      ).rejects.toThrow(
        'Error al crear el sensor: Datos inválidos: "name" is not allowed to be empty',
      );
    });
  });

  describe("getSensorById", () => {
    it("should return sensor data by ID", async () => {
      const mockSensor = {
        id: 1,
        name: "Humidity Sensor",
        node_id: null,
        status: "inactive",
        supported_types: [],
        nodes: null,
      };
      SensorModel.getSensorById.mockResolvedValue(mockSensor);

      const result = await SensorService.getSensorById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe("Humidity Sensor");
    });

    it("should throw an error if ID is invalid", async () => {
      await expect(SensorService.getSensorById(null)).rejects.toThrow(
        'Error fetching sensor by ID: ID inválido: "id" must be a number',
      );
    });

    it("should return a null if sensor not found", async () => {
      SensorModel.getSensorById.mockResolvedValue(null);

      const result = await SensorService.getSensorById(999);

      expect(result).toBeNull();
    });
  });

  describe("getAllSensors", () => {
    it("should return a list of sensors", async () => {
      SensorModel.getAllSensors.mockResolvedValue([
        { id: 1, name: "Sensor A", node_id: null, status: "active" },
      ]);

      const sensors = await SensorService.getAllSensors();
      expect(sensors).toHaveLength(1);
      expect(sensors[0].name).toBe("Sensor A");
    });

    it("should throw an error if fetching fails", async () => {
      SensorModel.getAllSensors.mockRejectedValue(new Error("DB error"));

      await expect(SensorService.getAllSensors()).rejects.toThrow(
        "Error fetching all sensors: DB error",
      );
    });
  });

  describe("updateSensor", () => {
    it("should update a sensor", async () => {
      SensorModel.updateSensor.mockResolvedValue({ id: 1, name: "Updated" });

      const result = await SensorService.updateSensor(1, { name: "Updated" });
      expect(result.name).toBe("Updated");
    });

    it("should throw an error if updating fails", async () => {
      SensorModel.updateSensor.mockRejectedValue(new Error("Update failed"));

      await expect(
        SensorService.updateSensor(1, { name: "Updated" }),
      ).rejects.toThrow("Error updating sensor: Update failed");
    });
  });

  describe("deleteSensor", () => {
    it("should delete a sensor by ID", async () => {
      SensorModel.deleteSensor.mockResolvedValue({ success: true });

      const result = await SensorService.deleteSensor(1);
      expect(result.success).toBe(true);
    });

    it("should throw an error if ID is invalid", async () => {
      await expect(SensorService.deleteSensor(null)).rejects.toThrow(
        'Error deleting sensor: ID inválido: "id" must be a number',
      );
    });

    it("should throw an error if deletion fails", async () => {
      SensorModel.deleteSensor.mockRejectedValue(new Error("Delete failed"));

      await expect(SensorService.deleteSensor(1)).rejects.toThrow(
        "Error deleting sensor: Delete failed",
      );
    });
  });

  describe("getAllSensorTypes", () => {
    it("should return all sensor types", async () => {
      SensorReadingTypeModel.getAllSensorReadingTypes.mockResolvedValue([
        { id: 1, name: "Temperature" },
      ]);

      const result = await SensorService.getAllSensorTypes();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Temperature");
    });
  });

  describe("getReadingsBySensorTypeId", () => {
    it("should return readings for a sensor type ID", async () => {
      SensorReadingModel.getReadingsBySensorTypeId.mockResolvedValue([
        { value: 23.5 },
      ]);

      const result = await SensorService.getReadingsBySensorTypeId(1);
      expect(result[0].value).toBe(23.5);
    });

    it("should throw an error if ID is invalid", async () => {
      await expect(
        SensorService.getReadingsBySensorTypeId(null),
      ).rejects.toThrow(
        'Error fetching readings by sensor type ID: Invalid sensor type ID: \"id\" must be a number',
      );
    });
  });

  describe("attachSensorsToNode", () => {
    it("should attach sensors to a node", async () => {
      SensorModel.updateSensorsForNode.mockResolvedValue([
        { id: 1 },
        { id: 2 },
      ]);
      const result = await SensorService.attachSensorsToNode(10, [1, 2]);
      expect(result).toHaveLength(2);
    });

    it("should throw error if validation fails", async () => {
      await expect(SensorService.attachSensorsToNode(null, [])).rejects.toThrow(
        "Datos inválidos",
      );
    });
  });

  describe("createSensorType", () => {
    it("should create a sensor type", async () => {
      SensorReadingTypeModel.createSensorReadingType.mockResolvedValue({
        id: 1,
        name: "Temperature",
      });

      const result = await SensorService.createSensorType(
        "Temperature",
        "°C",
        "Measures heat",
      );
      expect(result.name).toBe("Temperature");
    });

    it("should throw error on validation failure", async () => {
      await expect(SensorService.createSensorType("", "", "")).rejects.toThrow(
        "Datos inválidos",
      );
    });
  });

  describe("updateSensorType", () => {
    it("should update a sensor type", async () => {
      SensorReadingTypeModel.updateSensorReadingType.mockResolvedValue({
        id: 1,
        name: "New name",
      });

      const result = await SensorService.updateSensorType(1, {
        name: "New name",
      });
      expect(result.name).toBe("New name");
    });
  });

  describe("deleteSensorType", () => {
    it("should delete a sensor type", async () => {
      SensorReadingTypeModel.deleteSensorReadingType.mockResolvedValue({
        success: true,
      });

      const result = await SensorService.deleteSensorType(1);
      expect(result.success).toBe(true);
    });
  });

  describe("createSensorSupportedType", () => {
    it("should create a supported type", async () => {
      SensorSupportedTypeModel.createSensorSupportedType.mockResolvedValue({
        id: 1,
      });

      const result = await SensorService.createSensorSupportedType({
        sensor_id: 1,
        type_id: 1,
      });

      expect(result.id).toBe(1);
    });
  });

  describe("getAllSensorSupportedTypes", () => {
    it("should return all supported sensor types", async () => {
      SensorSupportedTypeModel.getAllSensorSupportedTypes.mockResolvedValue([
        { id: 1, name: "Humidity" },
      ]);

      const result = await SensorService.getAllSensorSupportedTypes();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("Humidity");
    });
  });

  describe("updateSensorSupportedType", () => {
    it("should update a supported sensor type", async () => {
      SensorSupportedTypeModel.updateSensorSupportedType.mockResolvedValue({
        id: 1,
        name: "Updated Type",
      });

      const result = await SensorService.updateSensorSupportedType(1, {
        name: "Updated Type",
      });
      expect(result.name).toBe("Updated Type");
    });
  });

  describe("deleteSensorSupportedType", () => {
    it("should delete a supported sensor type", async () => {
      SensorSupportedTypeModel.deleteSensorSupportedType.mockResolvedValue({
        success: true,
      });

      const result = await SensorService.deleteSensorSupportedType(1);
      expect(result.success).toBe(true);
    });
  });
});
