const { Status } = require("@prisma/client");
const prisma = require("../prisma");

const NodeModel = {
  async createNode(name, location, status, projectId) {
    return prisma.nodes.create({
      data: {
        name: name,
        location: location,
        status: status,
        project_id: projectId,
      },
      include: {
        projects: true,
        sensors: true,
      },
    });
  },

  async getNodeById(id) {
    return prisma.nodes.findUnique({
      where: { id: id },
    });
  },

  async updateNode(id, name, location, status, projectId) {
    return prisma.nodes.update({
      where: { id: id },
      data: {
        name: name,
        location: location,
        status: status,
        project_id: projectId,
      },
      include: {
        projects: true,
        sensors: true,
      },
    });
  },

  async deleteNode(id) {
    return prisma.nodes.delete({
      where: { id: id },
    });
  },

  async getAllNodes() {
    return prisma.nodes.findMany({
      include: {
        projects: true,
        sensors: true,
      },
    });
  },

  async getNodesByProjectId(projectId) {
    return prisma.nodes.findMany({
      where: { project_id: projectId },
      include: {
        projects: true,
        sensors: true,
      },
    });
  },
};
module.exports = { NodeModel };
