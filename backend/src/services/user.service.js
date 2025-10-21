const { UserModel } = require("../models/user.model");
const { RoleModel } = require("../models/role.model");
const bcrypt = require("bcryptjs");
const { CompanyModel } = require("../models/company.model");

/** * Servicio para la gestión de usuarios.
 *  Este servicio permite crear, obtener, actualizar y eliminar usuarios,
 *  así como cambiar contraseñas y manejar roles y empresas asociadas.
 */
class UserService {
  /**
   * Obtiene todos los usuarios registrados.
   *
   * @returns {Promise<Array<Object>>} Lista de usuarios con sus roles y empresas.
   * @throws {Error} Si ocurre un error al obtener los usuarios.
   */
  static async getAllUsers() {
    try {
      const users = await UserModel.getAllUsers();
      return users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.user_roles.name,
        company: user.companies?.name || null,
      }));
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  /**
   * Obtiene un usuario por su ID.
   *
   * @param {number|string} id - ID del usuario a buscar.
   * @returns {Promise<Object>} Usuario encontrado.
   * @throws {Error} Si ocurre un error durante la búsqueda.
   */
  static async getUserById(id) {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }
      const user = await UserModel.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  /**
   * Recupera un usuario por su correo electrónico.
   * @param {string} email - Correo electrónico del usuario.
   * @returns {Promise<Object>} Usuario encontrado.
   * @throws {Error} Si ocurre un error durante la búsqueda o si el usuario no existe.
   */
  static async getUserByEmail(email) {
    try {
      if (!email) {
        throw new Error("Email is required");
      }
      const user = await UserModel.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  /**
   * Actualiza un usuario existente con nuevos datos.
   * @param {number|string} id - ID del usuario a actualizar.
   * @param {Object} updates - Nuevos datos para el usuario.
   * @returns {Promise<Object>} Usuario actualizado.
   * @throws {Error} Si ocurre un error durante la actualización o si los datos son inválidos.
   */
  static async updateUser(id, updates) {
    try {
      if (!id || !updates) {
        throw new Error("User ID and updates are required");
      }

      const numericId = parseInt(id, 10);

      if (numericId !== updates.id) {
        throw new Error("User ID in updates does not match the provided ID");
      }

      // delete id from updates to avoid conflicts
      updates.id = undefined;

      // check role
      if (updates.role) {
        const role = await RoleModel.getRoleByName(updates.role);
        if (!role) {
          throw new Error("Invalid role specified");
        }
        updates.user_roles = { connect: { id: role.id } };
        updates.role = undefined; // Remove role from updates to avoid conflicts
      }

      // check company
      if (updates.company) {
        const company = await CompanyModel.getCompanyByName(updates.company);
        if (!company) {
          throw new Error("Company not found");
        }
        updates.companies = { connect: { id: company.id } };
        updates.company = undefined; // Remove company from updates to avoid conflicts
      }

      const user = await UserModel.updateUser(numericId, updates);
      if (!user) {
        throw new Error("User not found or update failed");
      }
      return user;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  /**
   * Elimina un usuario por su ID.
   * @param {number|string} id - ID del usuario a eliminar.
   * @returns {Promise<Object>} Resultado de la eliminación.
   * @throws {Error} Si el ID es inválido o si ocurre un error durante la eliminación.
   */
  static async deleteUser(id) {
    try {
      if (!id) {
        throw new Error("User ID is required");
      }

      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Invalid user ID");
      }

      const result = await UserModel.deleteUser(numericId);
      if (!result) {
        throw new Error("User not found or deletion failed");
      }
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }

  /**
   * Cambia la contraseña de un usuario.
   * @param {number|string} id - ID del usuario.
   * @param {string} currentPassword - Contraseña actual del usuario.
   * @param {string} newPassword - Nueva contraseña para el usuario.
   * @returns {Promise<Object>} Mensaje de éxito y datos del usuario actualizado.
   * @throws {Error} Si los datos son inválidos, si el usuario no existe,
   *                 o si la contraseña actual no coincide.
   */
  static async changePassword(id, currentPassword, newPassword) {
    try {
      if (!id || !currentPassword || !newPassword) {
        throw new Error(
          "User ID, current password, and new password are required",
        );
      }
      const user = await UserModel.getUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        throw new Error("Old password is incorrect");
      }
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);
      const numericId = parseInt(id, 10);
      const updatedUser = await UserModel.updateUser(numericId, {
        password: hashedNewPassword,
      });

      return {
        message: "Password changed successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.user_roles.name,
        },
      };
    } catch (error) {
      throw new Error(`Error changing password: ${error.message}`);
    }
  }
}

module.exports = { UserService };
