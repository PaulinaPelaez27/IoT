const prisma = require("../prisma");

class AlertUserModel {
  static async getAlertUserById(id) {
    return prisma.alerts_users.findUnique({
      where: { id: id },
    });
  }

  static async getAllAlertUsers() {
    return prisma.alerts_users.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  static async markAlertAsRead(read, id, userId) {
    return prisma.alerts_users.update({
      where: { alert_id_user_id: { alert_id: id, user_id: userId } },
      data: { is_read: read },
    });
  }

  static async markAllAlertsAsRead(userId) {
    return prisma.alerts_users.updateMany({
      where: { is_read: false, user_id: userId },
      data: { is_read: true },
    });
  }
}

module.exports = { AlertUserModel };
