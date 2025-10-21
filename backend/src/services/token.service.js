const jwt = require("jsonwebtoken");

/**
 * Genera un token para un usuario dado.
 * @param {Object} payload - Datos a incluir en el token (id, rol, email, etc.).
 * @returns {string} El token firmado.
 */
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}

/**
 * Verifica y decodifica un token.
 * @param {string} token - El token a verificar.
 * @returns {Object} Los datos del token decodificado si es válido.
 * @throws {Error} Si el token es inválido o ha expirado.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Token inválido o expirado");
  }
}

module.exports = {
  generateToken,
  verifyToken,
};
