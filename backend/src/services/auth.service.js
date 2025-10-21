const { generateToken, verifyToken } = require("./token.service");
const bcrypt = require("bcryptjs");

const { UserModel } = require("../models/user.model");

/**
 * Servicio de autenticación.
 *
 * Este servicio maneja el registro, inicio de sesión y verificación de tokens.
 * También se encarga del cifrado de contraseñas usando bcrypt y de la generación/verificación de JWTs.
 */
class AuthService {
  /**
   * Cifra una contraseña utilizando bcrypt.
   *
   * @param {string} password - Contraseña en texto plano.
   * @returns {Promise<string>} Contraseña cifrada (hash).
   * @throws {Error} Si ocurre un error al cifrar la contraseña.
   */
  static async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Error hashing password: ${error.message}`);
    }
  }

  /**
   * Verifica si una contraseña coincide con su hash cifrado.
   *
   * @param {string} password - Contraseña en texto plano.
   * @param {string} hashedPassword - Contraseña cifrada.
   * @returns {Promise<boolean>} `true` si las contraseñas coinciden.
   * @throws {Error} Si ocurre un error durante la comparación.
   */
  static async checkPassword(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error(`Error checking password: ${error.message}`);
    }
  }

  /**
   * Autentica a un usuario con su correo electrónico y contraseña.
   *
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña en texto plano.
   * @returns {Promise<{user: Object, token: string}>} Objeto con los datos del usuario autenticado y su token JWT.
   * @throws {Error} Si los datos son inválidos o la autenticación falla.
   */
  static async login(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const user = await UserModel.getUserByEmail(email);
      if (!user || !this.checkPassword(password, user.password)) {
        throw new Error("Invalid email or password");
      }

      const userDto = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.user_roles?.name || user.user_roles,
        company: user.companies?.name || null,
        companyId: user.companies?.id || null,
      };

      // generar token
      const token = generateToken({
        id: user.id,
        name: user.name,
        role: user.user_roles?.name || user.user_roles,
        email: user.email,
        company: user.companies?.name || null,
        companyId: user.companies?.id || null,
      });

      return { user: userDto, token };
    } catch (error) {
      throw new Error(`Error logging in user: ${error.message}`);
    }
  }

  /**
   * Registra un nuevo usuario en el sistema.
   *
   * @param {string} username - Nombre del usuario.
   * @param {string} email - Correo electrónico.
   * @param {string} password - Contraseña en texto plano.
   * @param {string} [role="user"] - Rol asignado al usuario (por defecto: "user").
   * @param {string|null} [company=null] - Empresa asociada al usuario.
   * @returns {Promise<{user: Object, token: string}>} Objeto con el usuario creado y su token JWT.
   * @throws {Error} Si el registro falla.
   */
  static async register(
    username,
    email,
    password,
    role = "user",
    company = null,
  ) {
    try {
      const hashedPassword = await this.hashPassword(password);
      const user = await UserModel.createUser(
        username,
        email,
        hashedPassword,
        role,
        company,
      );
      const token = generateToken({
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        company: user.company,
      });
      return { user, token };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  /**
   * Verifica y decodifica un token JWT.
   *
   * @param {string} token - Token JWT a verificar.
   * @returns {Object} Nuevo token y datos decodificados del token (usuario).
   * @throws {Error} Si el token no es válido o ha expirado.
   */
  static async verifyToken(token) {
    try {
      const decoded = verifyToken(token);
      return {
        user: {
          id: decoded.id,
          name: decoded.name,
          role: decoded.role,
          email: decoded.email,
          company: decoded.company,
          companyId: decoded.companyId,
        },
      };
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
}
module.exports = { AuthService };
