const prisma = require("../prisma");

class SensorReadingTypeModel {
  static async createSensorReadingType(name, unit, description) {
    return prisma.sensor_reading_types.create({
      data: {
        name,
        unit,
        description,
      },
    });
  }

  static async getAllSensorReadingTypes() {
    return prisma.sensor_reading_types.findMany();
  }

  static async updateSensorReadingType(id, sensorReadingTypeData) {
    return prisma.sensor_reading_types.update({
      where: { id: id },
      data: sensorReadingTypeData,
    });
  }

  static async deleteSensorReadingType(id) {
    return prisma.sensor_reading_types.delete({
      where: { id: id },
    });
  }
}

module.exports = { SensorReadingTypeModel };
