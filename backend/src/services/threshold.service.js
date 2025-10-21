const { ThresholdModel } = require("../models/threshold.model");

/**
 * Servicio para la gestión de umbrales.
 *
 * Este servicio permite crear, actualizar, eliminar y obtener umbrales,
 * centralizando la lógica de negocio relacionada a estos componentes.
 **/
class ThresholdService {
  /**
   * Crea un nuevo umbral con los datos proporcionados.
   *
   * @param {Object} thresholdData - Datos del umbral (nombre, valor, etc.).
   * @returns {Promise<Object>} Umbral creado exitosamente.
   * @throws {Error} Si ocurre un error al crear el umbral.
   **/
  static async createThreshold(thresholdData) {
    return ThresholdModel.createThreshold(thresholdData);
  }

  /**
   * Obtiene un umbral por su ID.
   *
   * @param {number|string} id - ID del umbral a buscar.
   * @returns {Promise<Object>} Umbral encontrado.
   * @throws {Error} Si ocurre un error durante la búsqueda.
   **/
  static async getThresholdById(id) {
    return ThresholdModel.getThresholdById(id);
  }

  /**
   * Obtiene todos los umbrales registrados.
   *
   * @returns {Promise<Array<Object>>} Lista de umbrales.
   * @throws {Error} Si ocurre un error al obtener los umbrales.
   **/
  static async getAllThresholds() {
    return ThresholdModel.getAllThresholds();
  }

  /**
   * Actualiza un umbral existente con nuevos datos.
   *
   * @param {number|string} id - ID del umbral a actualizar.
   * @param {Object} thresholdData - Nuevos datos para el umbral.
   * @returns {Promise<Object>} Umbral actualizado.
   * @throws {Error} Si ocurre un error durante la actualización.
   **/
  static async updateThreshold(id, thresholdData) {
    return ThresholdModel.updateThreshold(id, thresholdData);
  }

  /**
   * Elimina un umbral por su ID.
   *
   * @param {number|string} id - ID del umbral a eliminar.
   * @returns {Promise<Object>} Resultado de la operación.
   * @throws {Error} Si ocurre un error al eliminar el umbral.
   **/
  static async deleteThreshold(id) {
    return ThresholdModel.deleteThreshold(id);
  }
}
module.exports = { ThresholdService };
