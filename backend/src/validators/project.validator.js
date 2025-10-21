const Joi = require("joi");

const { nodeSchema } = require("./node.validator");

const projectSchema = Joi.object({
  id: Joi.number().integer().positive(),
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().allow("", null),
  companyId: Joi.number().integer().positive().allow(null),
  nodes: Joi.array().items(nodeSchema).default([]),
});

const deleteProjectSchema = Joi.object({
  id: Joi.number().required(),
});

module.exports = { projectSchema, deleteProjectSchema };
