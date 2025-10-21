const { Router } = require("express");
const { AuthService } = require("../services/auth.service");
const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");

const authRoutes = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario (solo para administradores autenticados)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validación, faltan datos requeridos
 *       401:
 *         description: No autenticado (token JWT faltante o inválido)
 *       403:
 *         description: No autorizado (solo administradores pueden registrar usuarios)
 *       500:
 *         description: Error interno del servidor
 */
authRoutes.post("/register", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    if (role && ["user"].includes(role) && !company) {
      return res
        .status(400)
        .json({ error: "El rol 'user' requiere una empresa asociada" });
    }

    const user = await AuthService.register(
      name,
      email,
      password,
      role,
      company,
    );
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión con email y contraseña
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "juan.perez@email.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Faltan datos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Faltan datos requeridos"
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Credenciales inválidas"
 *       500:
 *         description: Error interno del servidor
 */
authRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const { user, token } = await AuthService.login(email, password);
    if (!token || !user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
    res.status(200).json({ message: "Inicio de sesión exitoso", user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Verifica si un token JWT es válido
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyResponse'
 *       401:
 *         description: Token inválido o no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Token inválido o expirado"
 */
authRoutes.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
    const decoded = await AuthService.verifyToken(token);
    res.status(200).json({
      message: "Token válido",
      user: decoded.user,
    });
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
});
module.exports = authRoutes;
