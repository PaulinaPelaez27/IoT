const { AlertModel } = require("../models/alert.model");
const { AlertUserModel } = require("../models/alert-user.model");
const {
  alertSchema,
  alertSchemaId,
  updateReadSchema,
} = require("../validators/alert.validator");

/**
 * Servicio para la gestión de alertas.
 * Este servicio proporciona funciones para crear, actualizar, eliminar y obtener alertas,
 * centralizando la lógica de negocio relacionada a estos componentes.
 */
class AlertService {
  /**
   * Crea una nueva alerta.
   * @param {Object} alertData - Datos de la alerta a crear.
   * @returns {Promise<Object>} Alerta creada.
   * @throws {Error} Si ocurre un error durante la creación.
   */
  static async createAlert(alertData) {
    // Llama al modelo para crear una nueva alerta con los datos proporcionados
    try {
      return await AlertModel.createAlert(alertData);
    } catch (error) {
      throw new Error(`Error creating alert: ${error.message}`);
    }
  }

  /**
   * Obtiene una alerta por su ID.
   * @param {string} id - ID de la alerta a buscar.
   * @returns {Promise<Object>} Alerta encontrada.
   * @throws {Error} Si ocurre un error durante la búsqueda.
   */
  static async getAlertById(id) {
    try {
      return await AlertModel.getAlertById(id);
    } catch (error) {
      throw new Error(`Error fetching alert by ID: ${error.message}`);
    }
  }

  /**
   * Obtiene todas las alertas.
   * @returns {Promise<Array>} Lista de todas las alertas.
   * @throws {Error} Si ocurre un error durante la obtención.
   */
  static async getAllAlerts() {
    try {
      return (await AlertModel.getAllAlerts()).map((alert) => ({
        id: alert.id,
        message: alert.message,
        level: alert.level,
        isRead: alert.alerts_users.some((user) => user.is_read),
        sensorId: alert.sensor_id,
        createdAt: alert.created_at,
      }));
    } catch (error) {
      throw new Error(`Error fetching all alerts: ${error.message}`);
    }
  }

  /**
   * Actualiza una alerta existente.
   * @param {string} id - ID de la alerta a actualizar.
   * @param {Object} alertData - Datos nuevos para la alerta.
   * @returns {Promise<Object>} Alerta actualizada.
   * @throws {Error} Si ocurre un error durante la actualización.
   */
  static async updateAlert(id, alertData) {
    try {
      return await AlertModel.updateAlert(id, alertData);
    } catch (error) {
      throw new Error(`Error updating alert: ${error.message}`);
    }
  }

  /**
   * Elimina una alerta por su ID.
   * @param {string} id - ID de la alerta a eliminar.
   * @returns {Promise<Object>} Resultado de la eliminación.
   * @throws {Error} Si ocurre un error durante la eliminación.
   */
  static async deleteAlert(id) {
    try {
      return await AlertModel.deleteAlert(id);
    } catch (error) {
      throw new Error(`Error deleting alert: ${error.message}`);
    }
  }

  /**
   * Marca una alerta como leída/no leída.
   * @param {boolean} read - Indica si la alerta debe ser marcada como leída (true) o no leída (false).
   * @param {string} id - ID de la alerta a marcar como leída/no leída.
   * @returns {Promise<Object>} Alerta actualizada.
   * @throws {Error} Si ocurre un error durante la actualización.
   */
  static async markAlertAsRead(read, id, userId) {
    try {
      const { value, error } = updateReadSchema.validate(
        { read, id, userId },
        { convert: true },
      );
      if (error) {
        throw new Error(`Invalid input: ${error.message}`);
      }
      return await AlertUserModel.markAlertAsRead(
        value.read,
        value.id,
        value.userId,
      );
    } catch (error) {
      throw new Error(`Error marking alert as read: ${error.message}`);
    }
  }

  /**
   * Marca todas las alertas como leídas.
   * @returns {Promise<Array>} Lista de alertas actualizadas.
   * @throws {Error} Si ocurre un error durante la actualización.
   */
  static async markAllAlertsAsRead(userId) {
    try {
      const { value, error } = alertSchemaId.validate(
        { id: userId },
        { convert: true },
      );
      if (error) {
        throw new Error(`Invalid user ID: ${error.message}`);
      }
      return await AlertUserModel.markAllAlertsAsRead(value.id);
    } catch (error) {
      throw new Error(`Error marking all alerts as read: ${error.message}`);
    }
  }

  /**
   * Obtiene las alertas de una compania por su ID.
   * @param {string} companyId - ID de la compañía para filtrar las alertas.
   * @returns {Promise<Array>} Lista de alertas de la compañía.
   * @throws {Error} Si ocurre un error durante la obtención.
   */
  static async getAlertsByCompanyId(companyId) {
    try {
      if (companyId === "0") {
        return await this.getAllAlerts();
      }
      const { value, error } = alertSchemaId.validate(
        { id: companyId },
        { convert: true },
      );
      if (error) {
        throw new Error(`Invalid company ID: ${error.message}`);
      }

      const alerts = (await AlertModel.getAlertsByCompanyId(value.id)).map(
        (alert) => ({
          id: alert.id,
          message: alert.message,
          level: alert.level,
          isRead: alert.alerts_users.some((user) => user.is_read),
          sensorId: alert.sensor_id,
          createdAt: alert.created_at,
        }),
      );
      return alerts;
    } catch (error) {
      throw new Error(`Error fetching alerts by company ID: ${error.message}`);
    }
  }
}

module.exports = { AlertService };
