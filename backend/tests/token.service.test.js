const jwt = require("jsonwebtoken");
const { verifyToken, generateToken } = require("../src/services/token.service");

jest.mock("jsonwebtoken");

process.env.JWT_SECRET = "supersecret";
process.env.JWT_EXPIRATION = "1h";

describe("TokenService", () => {
  describe("generateToken", () => {
    it("should generate a JWT with correct payload", () => {
      const user = {
        id: 42,
        user_roles: { name: "admin" },
        email: "kaeli@example.com",
        company: "Test Inc",
      };

      jwt.sign.mockReturnValue("mockedToken");

      const token = generateToken({
        id: user.id,
        role: user.user_roles?.name || user.user_roles,
        email: user.email,
        company: user.company,
      });

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: 42,
          role: "admin",
          email: "kaeli@example.com",
          company: "Test Inc",
        },
        "supersecret",
        { expiresIn: "1h" },
      );

      expect(token).toBe("mockedToken");
    });
  });

  describe("verifyToken", () => {
    it("should return decoded payload if token is valid", () => {
      const mockDecoded = {
        id: 1,
        email: "kaeli@example.com",
        role: "admin",
        company: "Test Inc",
      };
      const mockToken = "valid.jwt.token";

      jwt.verify.mockReturnValue(mockDecoded);

      const result = verifyToken(mockToken);
      expect(result).toEqual(mockDecoded);
    });

    it("should throw error if token is invalid", () => {
      const mockToken = "invalid.jwt.token";
      jwt.verify.mockImplementation(() => {
        throw new Error("invalid token");
      });

      expect(() => verifyToken(mockToken)).toThrow("Token inválido o expirado");
    });
  });
});
