const { Router } = require("express");

const { ProjectService } = require("../services/project.service");
const {
  authenticate,
  authorizeCompanyId,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");

const projectRoutes = Router();
projectRoutes.use(authenticate);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crea un nuevo proyecto
 *     tags: [Projects]
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
 *               description:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Proyecto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error interno del servidor
 */
projectRoutes.post("/", async (req, res) => {
  try {
    const { name, description, companyId, nodes } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const project = await ProjectService.createProject(
      name,
      description,
      companyId,
      nodes,
    );
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualiza un proyecto por su ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
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
 *               description:
 *                 type: string
 *               companyId:
 *                 type: integer
 *               nodes:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Proyecto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error interno del servidor
 */
projectRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, companyId, nodes } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const project = await ProjectService.updateProject(
      id,
      name,
      description,
      companyId,
      nodes,
    );
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Elimina un proyecto por su ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       204:
 *         description: Proyecto eliminado exitosamente
 *       500:
 *         description: Error interno del servidor
 */
projectRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ProjectService.deleteProject(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtiene todos los proyectos
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Error interno del servidor
 */
projectRoutes.get("/", authorizeAdmin, async (req, res) => {
  try {
    const projects = await ProjectService.getAllProjects();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Obtiene un proyecto por su ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proyecto
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Proyecto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
projectRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);
    if (!project) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/projects/company/{companyId}:
 *   get:
 *     summary: Obtiene proyectos por ID de empresa
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Lista de proyectos de la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       404:
 *         description: Empresa no encontrada
 *       500:
 *         description: Error interno del servidor
 */
projectRoutes.get(
  "/company/:companyId",
  authorizeCompanyId,
  async (req, res) => {
    try {
      const { companyId } = req.params;
      const projects = await ProjectService.getProjectsByCompanyId(companyId);
      if (!projects || projects.length === 0) {
        return res.status(404).json({ error: "Empresa no encontrada" });
      }
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
);
module.exports = projectRoutes;
