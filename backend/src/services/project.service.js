const { ProjectModel } = require("../models/project.model");
const {
  projectSchema,
  deleteProjectSchema,
} = require("../validators/project.validator");

/**
 * @typedef {Object} NodeInput
 * @property {number} id - ID del nodo.
 * @property {string} [name] - Nombre del nodo.
 */

/**
 * Servicio para la gestión de proyectos.
 * Incluye creación, actualización, eliminación y obtención de proyectos,
 * validando los datos y controlando las reglas de negocio.
 */
class ProjectService {
  /**
   * Crea un nuevo proyecto después de validar los datos y verificar que no exista uno con el mismo nombre.
   *
   * @param {string} name - Nombre del proyecto.
   * @param {string} description - Descripción del proyecto.
   * @param {number|string} companyId - ID de la empresa asociada.
   * @param {NodeInput[]} [nodes=[]] - IDs de los nodos asociados al proyecto.
   *
   * @returns {Promise<Project>} Proyecto creado exitosamente.
   *
   * @throws {Error} Si los datos son inválidos o el proyecto ya existe.
   */
  static async createProject(name, description, companyId, nodes = []) {
    try {
      const { value, error } = projectSchema.validate(
        { name, description, companyId, nodes },
        { convert: true },
      );

      if (error) throw new Error(`Datos inválidos: ${error.message}`);
      // Check if the project already exists
      const existingProject = await ProjectModel.getProjectByName(value.name);
      if (existingProject) {
        throw new Error(`El proyecto con el nombre ${value.name} ya existe`);
      }
      return await ProjectModel.createProject(
        value.name,
        value.description,
        value.companyId,
        value.nodes,
      );
    } catch (error) {
      throw new Error(`Error al crear el proyecto: ${error.message}`);
    }
  }

  /**
   * Actualiza un proyecto existente con nuevos valores.
   *
   * @param {number} id - ID del proyecto a actualizar.
   * @param {string} name - Nuevo nombre del proyecto.
   * @param {string} description - Nueva descripción.
   * @param {number|string} companyId - ID de la empresa asociada.
   * @param {NodeInput[]} [nodes=[]] - IDs de los nodos a vincular.
   *
   * @returns {Promise<Project>} Proyecto actualizado.
   *
   * @throws {Error} Si los datos son inválidos o ocurre un error en la base de datos.
   */
  static async updateProject(id, name, description, companyId, nodes = []) {
    try {
      const { value, error } = projectSchema.validate(
        {
          id,
          name,
          description,
          companyId,
          nodes,
        },
        { convert: true },
      );

      if (error) throw new Error(`Datos inválidos: ${error.message}`);

      return await ProjectModel.updateProject(
        value.id,
        value.name,
        value.description,
        value.companyId,
        value.nodes,
      );
    } catch (error) {
      throw new Error(`Error al actualizar el proyecto: ${error.message}`);
    }
  }

  /**
   * Elimina un proyecto por su ID.
   *
   * @param {number} id - ID del proyecto a eliminar.
   *
   * @returns {Promise<boolean>} `true` si se eliminó correctamente.
   *
   * @throws {Error} Si ocurre un error durante la eliminación.
   */
  static async deleteProject(id) {
    try {
      const { value, error } = deleteProjectSchema.validate(
        { id },
        { convert: true },
      );

      if (error) throw new Error(`Datos inválidos: ${error.message}`);
      return await ProjectModel.deleteProject(value.id);
    } catch (error) {
      throw new Error(`Error al eliminar el proyecto: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los proyectos existentes junto con sus empresas asociadas y nodos.
   *
   * @returns {Promise<Array<Object>>} Lista de proyectos en formato DTO,
   * incluyendo la información básica de la empresa asociada.
   *
   * @throws {Error} Si ocurre un error al obtener los proyectos.
   */
  static async getAllProjects() {
    try {
      const projects = await ProjectModel.getAllProjects();
      const projectsDto = projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        companyId: project.company_id,
        nodes: project.nodes,
        company: project.companies
          ? {
              id: project.companies.id,
              name: project.companies.name,
            }
          : null,
      }));
      return projectsDto;
    } catch (error) {
      throw new Error(`Error al obtener los proyectos: ${error.message}`);
    }
  }

  /**
   * Obtiene un proyecto por el ID de la empresa asociada.
   * @param {number} companyId - ID de la empresa asociada.
   * @returns {Promise<Array<Object>>} Lista de proyectos asociados a la empresa.
   * @throws {Error} Si ocurre un error al obtener los proyectos.
   */
  static async getProjectsByCompanyId(companyId) {
    try {
      if (companyId == 0) {
        return await ProjectService.getAllProjects();
      }

      const { value, error } = deleteProjectSchema.validate(
        { id: companyId },
        { convert: true },
      );
      const projects = await ProjectModel.getProjectsByCompanyId(value.id);
      return projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        companyId: project.company_id,
        company: project.companies
          ? {
              id: project.companies.id,
              name: project.companies.name,
            }
          : null,
      }));
    } catch (error) {
      throw new Error(`Error al obtener los proyectos: ${error.message}`);
    }
  }
}

module.exports = { ProjectService };
