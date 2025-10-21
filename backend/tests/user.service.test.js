const { UserService } = require("../src/services/user.service");
const { UserModel } = require("../src/models/user.model");
const { RoleModel } = require("../src/models/role.model");
const { CompanyModel } = require("../src/models/company.model");
const bcrypt = require("bcryptjs");

jest.mock("../src/models/user.model");
jest.mock("../src/models/role.model");
jest.mock("../src/models/company.model");
jest.mock("bcryptjs");

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return a formatted list of users", async () => {
      UserModel.getAllUsers.mockResolvedValue([
        {
          id: 1,
          name: "Kaeli",
          email: "kaeli@example.com",
          user_roles: { name: "admin" },
          companies: { name: "TechCorp" },
        },
      ]);

      const result = await UserService.getAllUsers();
      expect(result).toEqual([
        {
          id: 1,
          name: "Kaeli",
          email: "kaeli@example.com",
          role: "admin",
          company: "TechCorp",
        },
      ]);
    });

    it("should throw error if something goes wrong", async () => {
      UserModel.getAllUsers.mockRejectedValue(new Error("DB failure"));
      await expect(UserService.getAllUsers()).rejects.toThrow(
        "Error fetching users: DB failure",
      );
    });
  });

  describe("getUserById", () => {
    it("should return user if found", async () => {
      UserModel.getUserById.mockResolvedValue({ id: 1, name: "Kaeli" });
      const result = await UserService.getUserById(1);
      expect(result).toEqual({ id: 1, name: "Kaeli" });
    });

    it("should throw if id is missing", async () => {
      await expect(UserService.getUserById(null)).rejects.toThrow(
        "User ID is required",
      );
    });

    it("should throw if user not found", async () => {
      UserModel.getUserById.mockResolvedValue(null);
      await expect(UserService.getUserById(99)).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      const mockUser = {
        id: 1,
        name: "Kaeli",
        email: "kaeli@example.com",
        password: "hashed",
        user_roles: { name: "admin" },
      };
      UserModel.getUserById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("newHashed");
      UserModel.updateUser.mockResolvedValue({
        ...mockUser,
        password: "newHashed",
      });

      const result = await UserService.changePassword(
        1,
        "oldPassword",
        "newPassword",
      );

      expect(result).toEqual({
        message: "Password changed successfully",
        user: {
          id: 1,
          name: "Kaeli",
          email: "kaeli@example.com",
          role: "admin",
        },
      });

      expect(bcrypt.compare).toHaveBeenCalledWith("oldPassword", "hashed");
    });

    it("should throw if passwords do not match", async () => {
      UserModel.getUserById.mockResolvedValue({ password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        UserService.changePassword(1, "wrong", "new"),
      ).rejects.toThrow("Old password is incorrect");
    });
  });

  describe("getUserByEmail", () => {
    it("returns a user if found", async () => {
      UserModel.getUserByEmail.mockResolvedValue({ id: 2, email: "a@b.com" });
      const res = await UserService.getUserByEmail("a@b.com");
      expect(res).toEqual({ id: 2, email: "a@b.com" });
    });

    it("throws if email is missing", async () => {
      await expect(UserService.getUserByEmail()).rejects.toThrow(
        "Email is required",
      );
    });

    it("throws if not found", async () => {
      UserModel.getUserByEmail.mockResolvedValue(null);
      await expect(UserService.getUserByEmail("x@y.z")).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("updateUser", () => {
    it("updates role & company successfully", async () => {
      RoleModel.getRoleByName.mockResolvedValue({ id: 5 });
      CompanyModel.getCompanyByName.mockResolvedValue({ id: 9 });
      UserModel.updateUser.mockResolvedValue({ id: 1, name: "Neo" });

      const updates = { id: 1, name: "Neo", role: "admin", company: "ACME" };
      const res = await UserService.updateUser(1, { ...updates });
      expect(RoleModel.getRoleByName).toHaveBeenCalledWith("admin");
      expect(CompanyModel.getCompanyByName).toHaveBeenCalledWith("ACME");
      expect(UserModel.updateUser).toHaveBeenCalledWith(1, {
        name: "Neo",
        user_roles: { connect: { id: 5 } },
        companies: { connect: { id: 9 } },
      });
      expect(res).toEqual({ id: 1, name: "Neo" });
    });

    it("throws if ID mismatch", async () => {
      await expect(UserService.updateUser(1, { id: 2 })).rejects.toThrow(
        "User ID in updates does not match the provided ID",
      );
    });

    it("throws if invalid role", async () => {
      RoleModel.getRoleByName.mockResolvedValue(null);
      const updates = { id: 1, role: "ghost" };
      await expect(UserService.updateUser(1, updates)).rejects.toThrow(
        "Invalid role specified",
      );
    });

    it("throws if company not found", async () => {
      RoleModel.getRoleByName.mockResolvedValue({ id: 3 }); // role OK
      CompanyModel.getCompanyByName.mockResolvedValue(null); // company not found
      const updates = { id: 1, role: "user", company: "??" };
      await expect(UserService.updateUser(1, updates)).rejects.toThrow(
        "Company not found",
      );
    });
  });

  describe("deleteUser", () => {
    it("deletes successfully", async () => {
      UserModel.deleteUser.mockResolvedValue(true);
      const res = await UserService.deleteUser(7);
      expect(UserModel.deleteUser).toHaveBeenCalledWith(7);
      expect(res).toEqual({ message: "User deleted successfully" });
    });

    it("throws if ID is missing", async () => {
      await expect(UserService.deleteUser()).rejects.toThrow(
        "User ID is required",
      );
    });

    it("throws if ID is invalid", async () => {
      await expect(UserService.deleteUser("abc")).rejects.toThrow(
        "Invalid user ID",
      );
    });

    it("throws if user not found", async () => {
      UserModel.deleteUser.mockResolvedValue(false);
      await expect(UserService.deleteUser(9)).rejects.toThrow(
        "User not found or deletion failed",
      );
    });
  });
});
