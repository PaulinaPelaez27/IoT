const jwt = require("jsonwebtoken");

// Middleware para autenticar y autorizar usuarios
// Verifica el token JWT y asigna el usuario al objeto de solicitud
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token ausente" });

  const token = authHeader.replace(/^Bearer\s+/i, "");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error al verificar el token:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(403).json({ error: "Token invalido" });
  }
};

// Middleware para autorizar acceso de administrador
// Verifica que el usuario tenga el rol de administrador
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Acceso denegado : Admin únicamente" });
  }
  next();
};

const authorizeCompanyId = (req, res, next) => {
  const companyIdReq = req.params.companyId || req.body.companyId;
  const companyId = parseInt(companyIdReq, 10);

  if (!companyIdReq || isNaN(companyId)) {
    return res.status(400).json({ error: "ID de empresa requerido" });
  }

  if (req.user.role === "admin" && companyId !== 0) {
    return res.status(403).json({ error: "Acceso denegado a empresa 0" });
  }

  if (req.user.role === "user" && req.user.companyId !== companyId) {
    return res.status(403).json({ error: "Acceso denegado a esta empresa" });
  }

  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeCompanyId,
};
