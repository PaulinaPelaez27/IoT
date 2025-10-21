const prisma = require("../prisma"); //Se importa el cliente Prisma para interactuar con la base de datos

class SensorModel {
  static async createSensor(name, nodeId = null, status = "INACTIVE") {
    return prisma.sensors.create({
      data: {
        name: name,
        node_id: nodeId,
        status: status,
      },
    });
  }

  static async getSensorByName(name) {
    return prisma.sensors.findUnique({
      where: { name: name },
    });
  }

  static async getSensorById(id) {
    return prisma.sensors.findUnique({
      where: { id: id },
      include: {
        supported_types: {
          include: {
            type: true,
          },
        },
        nodes: true,
      },
    });
  }

  static async getAllSensors() {
    return prisma.sensors.findMany();
  }

  static async getSensorsByNodeId(nodeId) {
    return prisma.sensors.findMany({
      where: { node_id: nodeId },
      include: {
        nodes: true,
      },
    });
  }

  static async updateSensor(id, sensorData) {
    return prisma.sensors.update({
      where: { id: id },
      data: sensorData,
    });
  }

  static async unsetSensorsFromNode(nodeId, sensorIds) {
    return prisma.sensors.updateMany({
      where: {
        node_id: nodeId,
        NOT: {
          id: { in: sensorIds },
        },
      },
      data: { node_id: null },
    });
  }

  static async setSensorsToNode(nodeId, sensorIds) {
    return prisma.sensors.updateMany({
      where: { id: { in: sensorIds } },
      data: { node_id: nodeId },
    });
  }

  static async getSensorsByIds(sensorIds) {
    return prisma.sensors.findMany({
      where: { id: { in: sensorIds } },
    });
  }
  static async updateSensorsForNode(nodeId, sensorIds) {
    return await prisma.$transaction(async (prisma) => {
      await this.unsetSensorsFromNode(nodeId, sensorIds);
      await this.setSensorsToNode(nodeId, sensorIds);
      return this.getSensorsByIds(sensorIds);
    });
  }

  static async deleteSensor(id) {
    return prisma.sensors.delete({
      where: { id: id },
    });
  }
}

module.exports = { SensorModel };
