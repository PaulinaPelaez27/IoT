const { Router } = require("express");

const { ThresholdService } = require("../services/threshold.service");

const thresholdRoutes = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Threshold:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Temperatura máxima"
 *         value:
 *           type: number
 *           example: 75.5
 *         sensorTypeId:
 *           type: integer
 *           example: 3
 *         operator:
 *           type: string
 *           example: ">"
 *       required:
 *         - name
 *         - value
 */

/**
 * @swagger
 * /api/thresholds:
 *   post:
 *     summary: Crea un nuevo umbral
 *     tags: [Thresholds]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Threshold'
 *     responses:
 *       201:
 *         description: Umbral creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Threshold'
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error interno del servidor
 */
thresholdRoutes.post("/", async (req, res) => {
  try {
    const thresholdData = req.body;
    if (!thresholdData.name || !thresholdData.value) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const threshold = await ThresholdService.createThreshold(thresholdData);
    res.status(201).json(threshold);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/thresholds/{id}:
 *   put:
 *     summary: Actualiza un umbral por su ID
 *     tags: [Thresholds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del umbral
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Threshold'
 *     responses:
 *       200:
 *         description: Umbral actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Threshold'
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error interno del servidor
 */
thresholdRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const thresholdData = req.body;
    if (!thresholdData.name || !thresholdData.value) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const threshold = await ThresholdService.updateThreshold(id, thresholdData);
    res.status(200).json(threshold);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/thresholds/{id}:
 *   delete:
 *     summary: Elimina un umbral por su ID
 *     tags: [Thresholds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del umbral
 *     responses:
 *       204:
 *         description: Umbral eliminado exitosamente
 *       500:
 *         description: Error interno del servidor
 */
thresholdRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await ThresholdService.deleteThreshold(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/thresholds:
 *   get:
 *     summary: Obtiene todos los umbrales
 *     tags: [Thresholds]
 *     responses:
 *       200:
 *         description: Lista de umbrales
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Threshold'
 *       500:
 *         description: Error interno del servidor
 */
thresholdRoutes.get("/", async (req, res) => {
  try {
    const thresholds = await ThresholdService.getAllThresholds();
    res.status(200).json(thresholds);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/thresholds/{id}:
 *   get:
 *     summary: Obtiene un umbral por su ID
 *     tags: [Thresholds]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del umbral
 *     responses:
 *       200:
 *         description: Umbral encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Threshold'
 *       404:
 *         description: Umbral no encontrado
 *       500:
 *         description: Error interno del servidor
 */
thresholdRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const threshold = await ThresholdService.getThresholdById(id);
    if (!threshold) {
      return res.status(404).json({ error: "Umbral no encontrado" });
    }
    res.status(200).json(threshold);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = thresholdRoutes;
