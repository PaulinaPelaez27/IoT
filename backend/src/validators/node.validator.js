const Joi = require("joi");

const statusMap = {
  activo: "ACTIVE",
  inactivo: "INACTIVE",
  "en Mantenimiento": "MAINTENANCE",
  error: "ERROR",
};

const nodeSchema = Joi.object({
  id: Joi.number().integer().positive(),
  name: Joi.string().min(2).max(255).required(),
  location: Joi.string().min(2).max(255).allow("", null),
  projectId: Joi.number().integer().positive().allow(null),
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
});

const nodeSchemaId = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = { nodeSchema, nodeSchemaId };
