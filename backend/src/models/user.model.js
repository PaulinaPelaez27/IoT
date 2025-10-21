const prisma = require("../prisma");

class UserModel {
  static async getAllUsers() {
    try {
      const users = await prisma.users.findMany({
        include: {
          user_roles: true,
          companies: true,
        },
      });
      return users;
    } catch (error) {
      throw new Error(`Error fetching users: ${error.message}`);
    }
  }

  static async createUser(username, email, password, role, company = null) {
    const roleId = await prisma.user_roles
      .findFirst({
        where: { name: role },
      })
      .then((role) => (role ? role.id : null));

    return prisma.users.create({
      data: {
        name: username,
        email: email,
        password: password,
        companies: company
          ? {
              connect: { id: company },
            }
          : undefined,
        user_roles: {
          connect: { id: roleId },
        },
      },
    });
  }

  static async getUserByEmail(email) {
    try {
      const user = await prisma.users.findUnique({
        where: { email: email },
        include: {
          user_roles: true,
          companies: true,
        },
      });
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  static async getUserById(id) {
    try {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error("Invalid user ID");
      }
      const user = await prisma.users.findUnique({
        where: { id: numericId },
        include: {
          user_roles: true,
        },
      });
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  static async updateUser(id, updates) {
    try {
      const data = { ...updates };

      const user = await prisma.users.update({
        where: { id },
        data,
        include: {
          user_roles: true,
          companies: true,
        },
      });

      return user;
    } catch (error) {
      console.error(`Error al actualizar el usuario ${id}:`, error);
      throw new Error(`Error al actualizar: ${error.message}`);
    }
  }

  static async deleteUser(id) {
    try {
      const user = await prisma.users.delete({
        where: { id: id },
      });
      return user;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = { UserModel };
