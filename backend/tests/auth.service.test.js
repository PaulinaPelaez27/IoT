const { AuthService } = require("../src/services/auth.service");
const { UserModel } = require("../src/models/user.model");
const bcrypt = require("bcryptjs");
const tokenService = require("../src/services/token.service");

// Mocks
jest.mock("../src/models/user.model");
jest.mock("bcryptjs");
jest.mock("../src/services/token.service");

describe("AuthService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassword", () => {
    it("should return a hashed password", async () => {
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const result = await AuthService.hashPassword("test123");
      expect(result).toBe("hashedPassword");
      expect(bcrypt.hash).toHaveBeenCalledWith("test123", "salt");
    });
  });

  describe("checkPassword", () => {
    it("should return true for matching passwords", async () => {
      bcrypt.compare.mockResolvedValue(true);
      const result = await AuthService.checkPassword("plain", "hashed");
      expect(result).toBe(true);
    });

    it("should return false for wrong password", async () => {
      bcrypt.compare.mockResolvedValue(false);
      const result = await AuthService.checkPassword("wrong", "hashed");
      expect(result).toBe(false);
    });
  });

  describe("login", () => {
    it("should throw error if email or password missing", async () => {
      await expect(AuthService.login(null, "pass")).rejects.toThrow(
        "Email and password are required",
      );
      await expect(AuthService.login("mail@test.com", null)).rejects.toThrow(
        "Email and password are required",
      );
    });

    it("should throw error if user not found", async () => {
      UserModel.getUserByEmail.mockResolvedValue(null);
      await expect(AuthService.login("no@mail.com", "pass")).rejects.toThrow(
        "Invalid email or password",
      );
    });

    it("should return user and token on valid login", async () => {
      const userMock = {
        id: 1,
        name: "Kaeli",
        email: "kaeli@example.com",
        password: "hashedPassword",
        user_roles: { name: "admin" },
        companies: { name: "TechCorp" },
      };
      UserModel.getUserByEmail.mockResolvedValue(userMock);
      bcrypt.compare.mockResolvedValue(true);
      tokenService.generateToken.mockReturnValue("mockedToken");

      const result = await AuthService.login(
        "kaeli@example.com",
        "validPassword",
      );

      expect(result).toEqual({
        user: {
          id: 1,
          name: "Kaeli",
          email: "kaeli@example.com",
          role: "admin",
          company: "TechCorp",
        },
        token: "mockedToken",
      });
    });
  });

  describe("register", () => {
    it("should register a user and return user + token", async () => {
      bcrypt.genSalt.mockResolvedValue("salt");
      bcrypt.hash.mockResolvedValue("hashed123");
      const mockUser = {
        id: 2,
        name: "New User",
        email: "new@user.com",
        role: "user",
        company: null,
      };
      UserModel.createUser.mockResolvedValue(mockUser);
      tokenService.generateToken.mockReturnValue("token123");

      const result = await AuthService.register(
        "New User",
        "new@user.com",
        "pass123",
      );

      expect(result).toEqual({ user: mockUser, token: "token123" });
    });
  });

  describe("verifyToken", () => {
    it("should return decoded token", async () => {
      tokenService.verifyToken.mockReturnValue({ id: 1 });
      const result = await AuthService.verifyToken("some.token.here");
      expect(result).toEqual({ id: 1 });
    });
  });
});
