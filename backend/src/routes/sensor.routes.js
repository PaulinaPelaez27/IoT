const { Router } = require("express");

const { SensorService } = require("../services/sensor.service");
const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/auth.middleware");

const sensorRoutes = Router();

sensorRoutes.use(authenticate);

/**
 * @swagger
 * components:
 *   schemas:
 *     SensorType:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del tipo de sensor
 *         name:
 *           type: string
 *           description: Nombre del tipo de sensor
 *         unit:
 *           type: string
 *           description: Unidad de medida del tipo de sensor
 *         description:
 *           type: string
 *           description: Descripción del tipo de sensor
 *       required:
 *         - name
 *         - unit
 *     Sensor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: ID del sensor
 *         name:
 *           type: string
 *           description: Nombre del sensor
 *         status:
 *           type: string
 *           description: Estado del sensor
 *         typeIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: IDs de los tipos de sensor a los que pertenece
 *       required:
 *         - name
 *         - status
 *         - typeIds
 */

/**
 * @swagger
 * /api/sensors/types:
 *   post:
 *     summary: Crea un nuevo tipo de sensor
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorType'
 *     responses:
 *       201:
 *         description: Tipo de sensor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorType'
 *       400:
 *         description: Datos requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 *     description: Esta ruta permite crear un nuevo tipo de sensor. Se requiere que el cuerpo de la solicitud contenga el nombre y la descripción del tipo de sensor.
 */
sensorRoutes.post("/types", async (req, res) => {
  try {
    const { name, unit, description } = req.body;
    if (!name || !unit) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const createdSensorType = await SensorService.createSensorType(
      name,
      unit,
      description,
    );
    res.status(201).json(createdSensorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/types:
 *   get:
 *     summary: Obtiene todos los tipos de sensores
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de sensores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SensorType'
 *       500:
 *         description: Error interno del servidor
 *     description: Esta ruta permite obtener todos los tipos de sensores registrados en el sistema.
 */
sensorRoutes.get("/types", async (req, res) => {
  try {
    const sensorTypes = await SensorService.getAllSensorTypes();
    // Ensure sensorTypes is always an array before mapping or returning
    if (!Array.isArray(sensorTypes)) {
      return res
        .status(500)
        .json({ error: "Los tipos de sensores no son un arreglo" });
    }
    res.status(200).json(sensorTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/types/{id}:
 *   get:
 *     summary: Obtiene un tipo de sensor por ID
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de sensor a obtener
 *     responses:
 *       200:
 *         description: Tipo de sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorType'
 *       404:
 *         description: Tipo de sensor no encontrado
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Mensaje de error
 */
sensorRoutes.get("/types/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sensorType = await SensorService.getSensorTypeBySensorId(id);
    if (!sensorType) {
      return res.status(404).json({ error: "Tipo de sensor no encontrado" });
    }
    res.status(200).json(sensorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/types/{id}:
 *   put:
 *     summary: Actualiza un tipo de sensor existente
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de sensor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorType'
 *     responses:
 *       200:
 *         description: Tipo de sensor actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SensorType'
 *       400:
 *         description: Datos requeridos faltantes
 *       404:
 *         description: Tipo de sensor no encontrado
 *       500:
 *         description: Error interno del servidor
 *     description: Esta ruta permite actualizar un tipo de sensor existente. Se requiere que el cuerpo de la solicitud contenga el nombre y la descripción del tipo de sensor. El ID del tipo de sensor a actualizar se pasa como parámetro en la URL.
 */
sensorRoutes.put("/types/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sensorTypeData = req.body;
    if (!sensorTypeData.name || !sensorTypeData.description) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const sensorType = await SensorService.updateSensorType(id, sensorTypeData);
    if (!sensorType) {
      return res.status(404).json({ error: "Tipo de sensor no encontrado" });
    }
    res.status(200).json(sensorType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/types/{id}:
 *   delete:
 *     summary: Elimina un tipo de sensor por ID
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de sensor a eliminar
 *     responses:
 *       204:
 *         description: Tipo de sensor eliminado exitosamente
 *       404:
 *         description: Tipo de sensor no encontrado
 *       500:
 *         description: Error interno del servidor
 *     description: Esta ruta permite eliminar un tipo de sensor existente. El ID del tipo de sensor a eliminar se pasa como parámetro en la URL.
 */
sensorRoutes.delete("/types/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await SensorService.deleteSensorType(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//----------------------------------------------

/**
 * @swagger
 * /api/sensors:
 *   post:
 *     summary: Crea un nuevo sensor
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       201:
 *         description: Sensor creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       400:
 *         description: Datos requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 *     description: Esta ruta permite crear un nuevo sensor. Se requiere que el cuerpo de la solicitud contenga el nombre y el ID del tipo de sensor al que pertenece.
 */
sensorRoutes.post("/", async (req, res) => {
  try {
    const { name, status, typeIds } = req.body;
    if (!name || !status || !typeIds) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const sensor = await SensorService.createSensor(name, status, typeIds);
    res.status(201).json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   get:
 *     summary: Obtiene un sensor por ID
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor a obtener
 *     responses:
 *       200:
 *         description: Sensor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       404:
 *         description: Sensor no encontrado
 *       500:
 *         description: Error del servidor
 */
sensorRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sensor = await SensorService.getSensorById(id);
    if (!sensor) {
      return res.status(404).json({ error: "Sensor no encontrado" });
    }
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Obtiene todos los sensores
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sensores obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 *       500:
 *         description: Error interno del servidor
 */
sensorRoutes.get("/", authorizeAdmin, async (req, res) => {
  try {
    const sensors = await SensorService.getAllSensors();
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   put:
 *     summary: Actualiza un sensor existente
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sensor'
 *     responses:
 *       200:
 *         description: Sensor actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 *       400:
 *         description: Datos requeridos faltantes
 *       404:
 *         description: Sensor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
sensorRoutes.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sensorData = req.body;
    if (!sensorData.name || !sensorData.typeId) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }
    const sensor = await SensorService.updateSensor(id, sensorData);
    res.status(200).json(sensor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/attach/node:
 *   put:
 *     summary: Actualiza los sensores de un nodo
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idNode:
 *                 type: integer
 *                 description: ID del nodo al que se asignarán los sensores
 *               sensorIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Lista de IDs de sensores a asignar al nodo
 *     responses:
 *       200:
 *         description: Sensores actualizados exitosamente para el nodo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 *       400:
 *         description: Datos requeridos faltantes
 *       500:
 *         description: Error interno del servidor
 */
sensorRoutes.put("/attach/node", async (req, res) => {
  try {
    const { idNode, sensorIds } = req.body;

    if (!idNode || !Array.isArray(sensorIds)) {
      return res.status(400).json({
        error: "Faltan datos requeridos en el cuerpo de la solicitud",
      });
    }

    const updatedSensors = await SensorService.attachSensorsToNode(
      idNode,
      sensorIds,
    );
    res.status(200).json(updatedSensors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/{id}:
 *   delete:
 *     summary: Elimina un sensor por ID
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor a eliminar
 *     responses:
 *       204:
 *         description: Sensor eliminado exitosamente
 *       404:
 *         description: Sensor no encontrado
 *       500:
 *         description: Error interno del servidor
 */
sensorRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await SensorService.deleteSensor(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/types/{id}/readings:
 *   get:
 *     summary: Obtiene las lecturas de un tipo de sensor por ID
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de sensor cuyas lecturas se desean obtener
 *     responses:
 *       200:
 *         description: Lecturas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de la lectura
 *                   value:
 *                     type: number
 *                     description: Valor de la lectura del sensor
 */
sensorRoutes.get("/readings/type/:idType", async (req, res) => {
  try {
    const { idType } = req.params;
    const readings = await SensorService.getReadingsBySensorTypeId(idType);
    if (!readings) {
      return res.status(404).json({ error: "Tipo de sensor no encontrado" });
    }
    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/readings/{idSensor}/{idType}:
 *   get:
 *     summary: Obtiene las lecturas de un sensor por ID y tipo
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idSensor
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del sensor cuyas lecturas se desean obtener
 *       - in: path
 *         name: idType
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de sensor cuyas lecturas se desean obtener
 *     responses:
 *       200:
 *         description: Lecturas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                     description: Fecha y hora de la lectura
 *                   value:
 *                     type: number
 *                     description: Valor de la lectura del sensor
 */
sensorRoutes.get("/readings/:idSensor/:idType", async (req, res) => {
  try {
    const { idSensor, idType } = req.params;
    const readings = await SensorService.getReadingsBySensorIdAndType(
      idSensor,
      idType,
    );
    if (!readings) {
      return res.status(404).json({ error: "Sensor no encontrado" });
    }
    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/sensors/node/{id}:
 *   get:
 *     summary: Obtiene los sensores de un nodo por ID
 *     tags: [Sensors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del nodo cujos sensores se desean obtener
 *     responses:
 *       200:
 *         description: Sensores obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Sensor'
 *       404:
 *         description: No se encontraron sensores para este nodo
 *       500:
 *         description: Error interno del servidor
 */
sensorRoutes.get("/node/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sensors = await SensorService.getSensorsByNodeId(id);
    if (!sensors) {
      return res
        .status(404)
        .json({ error: "No se encontraron sensores para este nodo" });
    }
    res.status(200).json(sensors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = sensorRoutes;
