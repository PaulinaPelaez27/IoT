const { NodeModel } = require("../models/node.model");
const { State } = require("../constants/states");
const { nodeSchema, nodeSchemaId } = require("../validators/node.validator");
const { sensors } = require("../prisma");

/**
 * Servicio para la gestión de nodos.
 *
 * Este servicio permite crear, actualizar, eliminar y obtener nodos,
 * validando los datos de entrada y normalizando los estados usando un enumerado.
 */
class NodeService {
  /**
   * Crea un nuevo nodo validando sus datos y asociándolo a un proyecto.
   *
   * @param {string} name - Nombre del nodo.
   * @param {string} location - Ubicación del nodo.
   * @param {string} status - Estado del nodo (clave del enum State).
   * @param {number|string} projectId - ID del proyecto al que pertenece.
   *
   * @returns {Promise<Object>} Nodo creado con estado transformado.
   * @throws {Error} Si los datos son inválidos o ocurre un error en la base de datos.
   */
  static async createNode(name, location, status, projectId) {
    try {
      // Validar los parámetros de entrada
      const { value, error } = nodeSchema.validate(
        {
          name,
          location,
          status,
          projectId,
        },
        { convert: true },
      );
      if (error) {
        throw new Error(`Error de validación: ${error.message}`);
      }
      const node = await NodeModel.createNode(
        value.name,
        value.location,
        value.status,
        value.projectId,
      );
      return {
        ...node,
        status: State[node.status], // Convertir el estado a un valor del enum State
      };
    } catch (error) {
      throw new Error(`Error al crear el nodo: ${error.message}`);
    }
  }

  /**
   * Obtiene un nodo por su ID y transforma su estado usando el enum State.
   *
   * @param {number|string} id - ID del nodo a buscar.
   * @returns {Promise<Object>} Nodo encontrado con estado y proyecto asociados.
   * @throws {Error} Si los datos son inválidos o ocurre un error.
   */
  static async getNodeById(id) {
    try {
      const { value, error } = nodeSchemaId.validate({ id }, { convert: true });
      if (error) throw new Error(`Error de validación: ${error.message}`);
      const node = await NodeModel.getNodeById(value.id);
      return {
        id: node.id,
        name: node.name,
        status: State[node.status],
        projectId: node.project_id,
        project: node.projects || [],
      };
    } catch (error) {
      throw new Error(`Error al obtener el nodo: ${error.message}`);
    }
  }

  /**
   * Actualiza un nodo existente con nuevos datos.
   *
   * @param {number|string} id - ID del nodo a actualizar.
   * @param {string} name - Nuevo nombre.
   * @param {string} location - Nueva ubicación.
   * @param {string} status - Nuevo estado.
   * @param {number|string} projectId - Nuevo ID de proyecto.
   *
   * @returns {Promise<Object>} Nodo actualizado.
   * @throws {Error} Si los datos son inválidos o falla la actualización.
   */
  static async updateNode(id, name, location, status, projectId) {
    try {
      const { value, error } = nodeSchema.validate(
        {
          id,
          name,
          location,
          status,
          projectId,
        },
        { convert: true },
      );
      if (error) {
        throw new Error(`Error de validación: ${error.message}`);
      }
      const node = await NodeModel.updateNode(
        value.id,
        value.name,
        value.location,
        value.status,
        value.projectId,
      );
      return {
        id: node.id,
        name: node.name,
        status: State[node.status], // Convertir el estado a un valor del enum State
        projectId: node.project_id, // Asegurarse de que projectId esté presente
        project: node.projects || [], // Asegurarse de que projects esté presente
      };
    } catch (error) {
      throw new Error(`Error al actualizar el nodo: ${error.message}`);
    }
  }

  /**
   * Elimina un nodo por su ID.
   *
   * @param {number|string} id - ID del nodo a eliminar.
   * @returns {Promise<Object>} Resultado de la operación.
   * @throws {Error} Si los datos son inválidos o ocurre un error en la base de datos.
   */
  static async deleteNode(id) {
    try {
      const { value, error } = nodeSchemaId.validate({ id }, { convert: true });
      if (error) throw new Error(`Error de validación: ${error.message}`);
      return await NodeModel.deleteNode(value.id);
    } catch (error) {
      throw new Error(`Error al eliminar el nodo: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los nodos registrados, transformando el estado a un valor del enum State.
   *
   * @returns {Promise<Array<Object>>} Lista de nodos con sus proyectos asociados.
   * @throws {Error} Si ocurre un error al obtener los datos.
   */
  static async getAllNodes() {
    try {
      const nodes = await NodeModel.getAllNodes();
      // Mapear los nodos para convertir el string de estado en un valor del enum State
      return nodes.map((node) => ({
        id: node.id,
        name: node.name,
        status: State[node.status],
        projectId: node.project_id, // Asegurarse de que projectId esté presente
        project: node.projects || [], // Asegurarse de que projects esté presente
        sensors: node.sensors || [], // Asegurarse de que sensors esté presente
      }));
    } catch (error) {
      throw new Error(`Error al obtener los nodos: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los nodos asociados a un proyecto específico.
   *
   * @param {number|string} projectId - ID del proyecto.
   * @returns {Promise<Array<Object>>} Lista de nodos asociados al proyecto.
   * @throws {Error} Si ocurre un error al obtener los nodos.
   */
  static async getNodesByProjectId(projectId) {
    try {
      const { value, error } = nodeSchemaId.validate(
        { id: projectId },
        { convert: true },
      );
      if (error) throw new Error(`Error de validación: ${error.message}`);
      const nodes = await NodeModel.getNodesByProjectId(value.id);
      return nodes.map((node) => ({
        id: node.id,
        name: node.name,
        status: State[node.status],
        projectId: node.project_id,
        project: node.projects || [],
        sensors: node.sensors || [],
      }));
    } catch (error) {
      throw new Error(
        `Error al obtener los nodos del proyecto: ${error.message}`,
      );
    }
  }
}

module.exports = { NodeService };
