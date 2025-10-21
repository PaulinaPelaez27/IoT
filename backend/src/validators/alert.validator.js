const Joi = require("joi");

const alertSchemaId = Joi.object({
  id: Joi.number().integer().positive(),
});

const alertSchema = Joi.object({
  id: Joi.number().integer().positive(),
  message: Joi.string().min(2).max(255).required(),
  level: Joi.string().valid("warning", "critical").required(),
  isRead: Joi.boolean().default(false),
  sensorId: Joi.number().integer().positive().allow(null),
});

const updateReadSchema = Joi.object({
  read: Joi.boolean().required(),
  id: Joi.number().integer().positive().required(),
  userId: Joi.number().integer().positive().required(),
});

module.exports = { alertSchema, alertSchemaId, updateReadSchema };
