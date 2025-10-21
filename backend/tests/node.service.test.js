const { NodeService } = require("../src/services/node.service");
const { NodeModel } = require("../src/models/node.model");
const { State } = require("../src/constants/states");
const {
  nodeSchema,
  nodeSchemaId,
} = require("../src/validators/node.validator");
const { sensors, projects } = require("../src/prisma");

jest.mock("../src/models/node.model");
jest.mock("../src/validators/node.validator");

describe("NodeService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createNode", () => {
    it("should create a node and return it with formatted status", async () => {
      nodeSchema.validate.mockReturnValue({
        value: {
          name: "N1",
          location: "Quito",
          status: "ONLINE",
          projectId: 1,
        },
      });
      NodeModel.createNode.mockResolvedValue({
        id: 1,
        name: "N1",
        status: "ONLINE",
      });

      const result = await NodeService.createNode("N1", "Quito", "ONLINE", 1);
      expect(result).toEqual({ id: 1, name: "N1", status: State.ONLINE });
    });

    it("should throw validation error", async () => {
      nodeSchema.validate.mockReturnValue({ error: new Error("invalid data") });
      await expect(NodeService.createNode("", "", "", null)).rejects.toThrow(
        "Error de validación: invalid data",
      );
    });
  });

  describe("getNodeById", () => {
    it("should return node by id with formatted status", async () => {
      nodeSchemaId.validate.mockReturnValue({ value: { id: 1 } });
      NodeModel.getNodeById.mockResolvedValue({
        id: 1,
        name: "NodeX",
        status: "ACTIVE",
        project_id: 4,
        projects: ["P1"],
      });

      const result = await NodeService.getNodeById(1);
      expect(result).toEqual({
        id: 1,
        name: "NodeX",
        status: "activo",
        projectId: 4,
        project: ["P1"],
      });
    });

    it("should return node with empty project array if projects is undefined", async () => {
      const mockNode = {
        id: 1,
        name: "Node A",
        project_id: 101,
        projects: undefined, // simulate no project linked
        status: "INACTIVE",
      };

      NodeModel.getNodeById.mockResolvedValue(mockNode);

      const result = await NodeService.getNodeById(1);

      expect(result).toEqual({
        id: 1,
        name: "Node A",
        status: "inactivo",
        projectId: 101,
        project: [],
      });
    });

    it("should throw validation error", async () => {
      nodeSchemaId.validate.mockReturnValue({ error: new Error("bad id") });
      await expect(NodeService.getNodeById(null)).rejects.toThrow(
        "Error de validación: bad id",
      );
    });
  });

  describe("updateNode", () => {
    it("should update and return the node", async () => {
      nodeSchema.validate.mockReturnValue({
        value: {
          id: 2,
          name: "Updated",
          location: "Loja",
          status: "MAINTENANCE",
          projectId: 3,
        },
      });
      NodeModel.updateNode.mockResolvedValue({
        id: 2,
        name: "Updated",
        status: "MAINTENANCE",
        project_id: 3,
        projects: [],
      });

      const result = await NodeService.updateNode(
        2,
        "Updated",
        "Loja",
        "MAINTENANCE",
        3,
      );

      expect(result).toEqual({
        id: 2,
        name: "Updated",
        status: State.MAINTENANCE,
        projectId: 3,
        project: [],
      });
    });

    it("should throw validation error on bad input", async () => {
      nodeSchema.validate.mockReturnValue({ error: new Error("bad input") });
      await expect(NodeService.updateNode("", "", "", "", "")).rejects.toThrow(
        "Error de validación: bad input",
      );
    });
  });

  describe("deleteNode", () => {
    it("should delete a node", async () => {
      nodeSchemaId.validate.mockReturnValue({ value: { id: 5 } });
      NodeModel.deleteNode.mockResolvedValue({ message: "Deleted" });

      const result = await NodeService.deleteNode(5);
      expect(result).toEqual({ message: "Deleted" });
    });

    it("should throw if validation fails", async () => {
      nodeSchemaId.validate.mockReturnValue({ error: new Error("invalid ID") });
      await expect(NodeService.deleteNode(null)).rejects.toThrow(
        "Error de validación: invalid ID",
      );
    });
  });

  describe("getAllNodes", () => {
    it("should return all nodes formatted", async () => {
      NodeModel.getAllNodes.mockResolvedValue([
        {
          id: 1,
          name: "N1",
          status: "ACTIVE",
          sensors: [],
          project_id: 2,
          projects: [],
        },
        {
          id: 2,
          name: "N2",
          status: "INACTIVE",
          sensors: [],
          project_id: 3,
          projects: [],
        },
      ]);

      const result = await NodeService.getAllNodes();

      expect(result).toEqual([
        {
          id: 1,
          name: "N1",
          status: State.ACTIVE,
          projectId: 2,
          project: [],
          sensors: [],
        },
        {
          id: 2,
          name: "N2",
          status: State.INACTIVE,
          projectId: 3,
          project: [],
          sensors: [],
        },
      ]);
    });

    it("should throw on DB error", async () => {
      NodeModel.getAllNodes.mockRejectedValue(new Error("connection lost"));
      await expect(NodeService.getAllNodes()).rejects.toThrow(
        "Error al obtener los nodos: connection lost",
      );
    });
  });
});
