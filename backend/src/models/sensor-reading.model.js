const prisma = require("../prisma");

class SensorReadingModel {
  static async getAllSensorReadings() {
    return prisma.sensor_readings.findMany();
  }

  static async getReadingsBySensorTypeId(sensorTypeId) {
    return prisma.sensor_readings.findMany({
      where: {
        type_id: sensorTypeId,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 100,
    });
  }

  static async getReadingsBySensorIdAndType(sensorId, typeId) {
    return prisma.sensor_readings.findMany({
      where: {
        sensor_id: sensorId,
        type_id: typeId,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 100,
    });
  }
}

module.exports = { SensorReadingModel };
