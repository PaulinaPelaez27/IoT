const prisma = require("../prisma");

class CompanyModel {
  static async createCompany(name, address) {
    return prisma.companies.create({
      data: {
        name: name,
        address: address,
      },
    });
  }

  static async updateCompany(id, name, address) {
    return prisma.companies.update({
      where: { id: id },
      data: {
        name: name,
        address: address,
      },
    });
  }

  static async deleteCompany(id) {
    return prisma.companies.delete({
      where: { id: id },
    });
  }

  static async getAllCompanies() {
    try {
      const companies = await prisma.companies.findMany();
      return companies;
    } catch (error) {
      throw new Error(`Error fetching companies: ${error.message}`);
    }
  }

  static async getCompanyById(id) {
    try {
      const company = await prisma.companies.findUnique({
        where: { id: id },
      });
      return company;
    } catch (error) {
      throw new Error(`Error fetching company by ID: ${error.message}`);
    }
  }

  static async getCompanyByName(name) {
    try {
      const company = await prisma.companies.findFirst({
        where: { name: name },
      });
      return company;
    } catch (error) {
      throw new Error(`Error fetching company by name: ${error.message}`);
    }
  }

  static async getCompanyByUserId(userId) {
    try {
      const company = await prisma.companies.findFirst({
        where: {
          users: {
            some: {
              id: userId,
            },
          },
        },
      });
      return company;
    } catch (error) {
      throw new Error(`Error fetching company by user ID: ${error.message}`);
    }
  }
}
module.exports = { CompanyModel };
