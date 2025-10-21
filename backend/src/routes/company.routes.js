const { Router } = require("express");
const { CompanyService } = require("../services/company.service");
const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");

const companyRoutes = Router();

companyRoutes.use(authenticate);

/**
 * @swagger
 * /api/companies:
 *   post:
 *     summary: Crea una nueva empresa
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Empresa creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error interno del servidor
 */
companyRoutes.post("/", async (req, res) => {
  try {
    const { name, address } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const company = await CompanyService.createCompany(name, address);
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Actualiza una empresa por su ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Empresa actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error interno del servidor
 */
companyRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const company = await CompanyService.updateCompany(id, name, address);
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Elimina una empresa por su ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       204:
 *         description: Empresa eliminada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
companyRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await CompanyService.deleteCompany(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies:
 *   get:
 *     summary: Obtiene la lista de todas las empresas
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Company'
 *       500:
 *         description: Error interno del servidor
 */
companyRoutes.get("/", async (req, res) => {
  try {
    const companies = await CompanyService.getAllCompanies();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies/{id}:
 *   get:
 *     summary: Obtiene una empresa por su ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error interno del servidor
 */
companyRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const company = await CompanyService.getCompanyById(id);
    if (!company) {
      return res.status(404).json({ error: "Empresa no encontrada" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/companies/name/{name}:
 *   get:
 *     summary: Obtiene una empresa por su nombre
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Company'
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error interno del servidor
 */
companyRoutes.get("/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const company = await CompanyService.getCompanyByName(name);
    if (!company) {
      return res.status(404).json({ error: "Empresa no encontrada" });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = companyRoutes;
