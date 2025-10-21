const prisma = require("../prisma");

class SensorSupportedTypeModel {
  static async createSensorSupportedType(sensorSupportedTypeData) {
    return prisma.sensor_supported_types.create({
      data: sensorSupportedTypeData,
    });
  }

  static async getAllSensorSupportedTypes() {
    return prisma.sensor_supported_types.findMany();
  }

  static async getSensorSupportedTypeBySensorId(sensorId) {
    return prisma.sensor_supported_types.findMany({
      where: { sensor_id: sensorId },
      include: {
        type: true,
      },
    });
  }

  static async updateSensorSupportedType(id, sensorSupportedTypeData) {
    return prisma.sensor_supported_types.update({
      where: { id: id },
      data: sensorSupportedTypeData,
    });
  }

  static async deleteSensorSupportedType(id) {
    return prisma.sensor_supported_types.delete({
      where: { id: id },
    });
  }
}
module.exports = { SensorSupportedTypeModel };
