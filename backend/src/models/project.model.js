const prisma = require("../prisma");

class ProjectModel {
  static async createProject(name, description, companyId, nodes = []) {
    return prisma.projects.create({
      data: {
        name: name,
        description: description,
        company_id: companyId,
        nodes: {
          create: nodes,
        },
      },
    });
  }

  static async updateProject(id, name, description, companyId, nodes = []) {
    return prisma.projects.update({
      where: { id: id },
      data: {
        name: name,
        description: description,
        company_id: companyId,
        nodes: {
          create: nodes,
        },
      },
    });
  }

  static async deleteProject(id) {
    return prisma.projects.delete({
      where: { id: id },
    });
  }

  static async getAllProjects() {
    try {
      const projects = await prisma.projects.findMany({
        include: {
          nodes: true,
          companies: true,
        },
      });
      return projects;
    } catch (error) {
      throw new Error(`Error fetching projects: ${error.message}`);
    }
  }

  static async getProjectById(id) {
    try {
      const project = await prisma.projects.findUnique({
        where: { id: id },
      });
      return project;
    } catch (error) {
      throw new Error(`Error fetching project by ID: ${error.message}`);
    }
  }

  static async getProjectByName(name) {
    try {
      const project = await prisma.projects.findFirst({
        where: { name: name },
      });
      return project;
    } catch (error) {
      throw new Error(`Error fetching project by name: ${error.message}`);
    }
  }

  static async getProjectsByCompanyId(companyId) {
    try {
      const projects = await prisma.projects.findMany({
        where: { company_id: companyId },
        include: {
          companies: true,
        },
      });
      return projects;
    } catch (error) {
      throw new Error(
        `Error fetching projects by company ID: ${error.message}`,
      );
    }
  }
}
module.exports = { ProjectModel };
