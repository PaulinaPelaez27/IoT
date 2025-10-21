const prisma = require("../prisma");

class AlertModel {
  static async createAlert(alertData) {
    return prisma.alerts.create({
      data: alertData,
    });
  }

  static async getAlertById(id) {
    return prisma.alerts.findUnique({
      where: { id: id },
    });
  }

  static async getAllAlerts() {
    return prisma.alerts.findMany({
      include: {
        alerts_users: true,
      },
      orderBy: { created_at: "desc" },
    });
  }

  static async updateAlert(id, alertData) {
    return prisma.alerts.update({
      where: { id: id },
      data: alertData,
    });
  }

  static async deleteAlert(id) {
    return prisma.alerts.delete({
      where: { id: id },
    });
  }

  static async getAlertsByCompanyId(companyId) {
    return prisma.alerts.findMany({
      where: {
        sensors: {
          some: {
            projects: {
              some: {
                company_id: companyId,
              },
            },
          },
        },
      },
      include: {
        alerts_users: true,
      },
      orderBy: { created_at: "desc" },
    });
  }
}

module.exports = { AlertModel };
