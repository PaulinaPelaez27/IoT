const prisma = require("../prisma");

class ThresholdModel {
  static async createThreshold(thresholdData) {
    return prisma.thresholds.create({
      data: thresholdData,
    });
  }

  static async getThresholdById(id) {
    return prisma.thresholds.findUnique({
      where: { id: id },
    });
  }

  static async getAllThresholds() {
    return prisma.thresholds.findMany();
  }

  static async updateThreshold(id, thresholdData) {
    return prisma.thresholds.update({
      where: { id: id },
      data: thresholdData,
    });
  }

  static async deleteThreshold(id) {
    return prisma.thresholds.delete({
      where: { id: id },
    });
  }
}
module.exports = { ThresholdModel };
