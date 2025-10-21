const Joi = require("joi");

const statusMap = {
  activo: "ACTIVE",
  inactivo: "INACTIVE",
  "en Mantenimiento": "MAINTENANCE",
  error: "ERROR",
};

// ---- Sensor Reading Type Schema ----
const SensorReadingTypeSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string()
    .custom((value, helpers) => {
      const normalized = value
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g,
          "",
        )
        .toLowerCase()
        .trim();
      return normalized;
    })
    .min(2)
    .max(255)
    .required(),
  unit: Joi.string().min(1).max(50).lowercase().required(),
  description: Joi.string().min(5).max(500).allow("", null),
});

const SensorReadingTypeSchemaWithoutId = Joi.object({
  name: Joi.string()
    .custom((value, helpers) => {
      const normalized = value
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF\uFE20-\uFE2F]/g,
          "",
        )
        .toLowerCase()
        .trim();
      return normalized;
    })
    .min(2)
    .max(255)
    .required(),
  unit: Joi.string().min(1).max(50).lowercase().required(),
  description: Joi.string().min(5).max(500).allow("", null),
});

// ---- Sensor Supported Type Schema ----
const sensorSupportedTypeSchema = Joi.object({
  id: Joi.number().integer().positive(),
  name: Joi.string().min(2).max(255).required(),
  nodeId: Joi.number().integer().positive().allow(null),
  status: Joi.string()
    .custom((value, helpers) => {
      if (["ACTIVE", "INACTIVE", "MAINTENANCE", "ERROR"].includes(value)) {
        return value;
      }
      if (statusMap[value]) {
        return statusMap[value];
      }
      return helpers.error("any.invalid");
    })
    .default("INACTIVE"),
  typeIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(0)
    .required(),
});

const sensorSchemaId = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const attachingSensorsToNodeSchema = Joi.object({
  idNode: Joi.number().integer().positive().required(),
  sensorIds: Joi.array()
    .items(Joi.number().integer().positive())
    .min(0)
    .required(),
});

const getReadingsBySensorIdAndType = Joi.object({
  idSensor: Joi.number().integer().positive().required(),
  idType: Joi.number().integer().positive().required(),
});

module.exports = {
  sensorSupportedTypeSchema,
  sensorSchemaId,
  SensorReadingTypeSchema,
  SensorReadingTypeSchemaWithoutId,
  attachingSensorsToNodeSchema,
  getReadingsBySensorIdAndType,
};
