const { CompanyModel } = require("../models/company.model");

/**
 * Servicio para la gestión de empresas.
 *
 * Este servicio proporciona funciones para crear, actualizar, eliminar y obtener empresas,
 * controlando errores como duplicación de nombres o restricciones de integridad referencial.
 */
class CompanyService {
  /**
   * Crea una nueva empresa si no existe ya una con el mismo nombre.
   *
   * @param {string} name - Nombre de la empresa.
   * @param {string} address - Dirección de la empresa.
   * @returns {Promise<Object>} Empresa creada exitosamente.
   * @throws {Error} Si la empresa ya existe o ocurre un error en la base de datos.
   */
  static async createCompany(name, address) {
    try {
      // Check if the company already exists
      const existingCompany = await CompanyModel.getCompanyByName(name);
      if (existingCompany) {
        throw new Error(`La empresa con el nombre ${name} ya existe`);
      }

      return await CompanyModel.createCompany(name, address);
    } catch (error) {
      throw new Error(`Error al crear la empresa: ${error.message}`);
    }
  }

  /**
   * Actualiza una empresa existente por su ID.
   *
   * @param {number|string} id - ID de la empresa a actualizar.
   * @param {string} name - Nuevo nombre de la empresa.
   * @param {string} address - Nueva dirección de la empresa.
   * @returns {Promise<Object>} Empresa actualizada.
   * @throws {Error} Si ocurre un error durante la actualización.
   */
  static async updateCompany(id, name, address) {
    try {
      const numberId = parseInt(id, 10);
      return await CompanyModel.updateCompany(numberId, name, address);
    } catch (error) {
      throw new Error(`Error al actualizar la empresa: ${error.message}`);
    }
  }

  /**
   * Elimina una empresa por su ID.
   *
   * @param {number|string} id - ID de la empresa a eliminar.
   * @returns {Promise<Object>} Resultado de la eliminación.
   * @throws {Error} Si la empresa tiene usuarios o proyectos asociados, o si ocurre otro error.
   */
  static async deleteCompany(id) {
    try {
      const numberId = parseInt(id, 10);
      return await CompanyModel.deleteCompany(numberId);
    } catch (error) {
      if (error.code === "P2003") {
        // P2003 is the error code for foreign key constraint violation
        throw new Error(
          `No se puede eliminar la empresa porque tiene usuarios o proyectos asociados.`,
        );
      } else {
        throw new Error(`Error al eliminar la empresa: ${error.message}`);
      }
    }
  }

  /**
   * Obtiene todas las empresas registradas.
   *
   * @returns {Promise<Array<Object>>} Lista de todas las empresas.
   * @throws {Error} Si ocurre un error al obtener los datos.
   */
  static async getAllCompanies() {
    try {
      return await CompanyModel.getAllCompanies();
    } catch (error) {
      throw new Error(`Error al obtener las empresas: ${error.message}`);
    }
  }

  /**
   * Obtiene una empresa por su ID.
   *
   * @param {number|string} id - ID de la empresa.
   * @returns {Promise<Object>} Empresa encontrada.
   * @throws {Error} Si ocurre un error al buscar la empresa.
   */
  static async getCompanyById(id) {
    try {
      return await CompanyModel.getCompanyById(id);
    } catch (error) {
      throw new Error(`Error al obtener la empresa por ID: ${error.message}`);
    }
  }
}
module.exports = { CompanyService };
