const { ProjectService } = require("../src/services/project.service");
const { ProjectModel } = require("../src/models/project.model");
const {
  projectSchema,
  deleteProjectSchema,
} = require("../src/validators/project.validator");

jest.mock("../src/models/project.model");
jest.mock("../src/validators/project.validator");

describe("ProjectService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createProject", () => {
    it("should create a new project", async () => {
      projectSchema.validate.mockReturnValue({
        value: { name: "P1", description: "desc", companyId: 1, nodes: [] },
      });
      ProjectModel.getProjectByName.mockResolvedValue(null);
      ProjectModel.createProject.mockResolvedValue({ id: 1, name: "P1" });

      const result = await ProjectService.createProject("P1", "desc", 1, []);
      expect(result).toEqual({ id: 1, name: "P1" });
    });

    it("should create a new project with empty nodes array", async () => {
      const mockProject = {
        id: 1,
        name: "Project X",
        description: "Test project",
        companyId: 123,
        nodes: [],
      };

      projectSchema.validate.mockReturnValue({
        value: {
          name: "Project X",
          description: "Test project",
          companyId: 123,
          nodes: [],
        },
      });
      ProjectModel.getProjectByName.mockResolvedValue(null);
      ProjectModel.createProject.mockResolvedValue(mockProject);

      const result = await ProjectService.createProject(
        "Project X",
        "Test project",
        123,
      );

      expect(ProjectModel.getProjectByName).toHaveBeenCalledWith("Project X");
      expect(ProjectModel.createProject).toHaveBeenCalledWith(
        "Project X",
        "Test project",
        123,
        [],
      );
      expect(result).toEqual(mockProject);
    });

    it("should throw if project exists", async () => {
      projectSchema.validate.mockReturnValue({
        value: { name: "P1", description: "desc", companyId: 1, nodes: [] },
      });
      ProjectModel.getProjectByName.mockResolvedValue({ id: 1 });

      await expect(
        ProjectService.createProject("P1", "desc", 1, []),
      ).rejects.toThrow("El proyecto con el nombre P1 ya existe");
    });

    it("should throw validation error", async () => {
      projectSchema.validate.mockReturnValue({
        error: new Error("Invalid data"),
      });

      await expect(
        ProjectService.createProject("", "", null, []),
      ).rejects.toThrow(
        "Error al crear el proyecto: Datos inválidos: Invalid data",
      );
    });
  });

  describe("updateProject", () => {
    it("should update a project", async () => {
      projectSchema.validate.mockReturnValue({
        value: {
          id: 1,
          name: "P2",
          description: "desc",
          companyId: 1,
          nodes: [],
        },
      });
      ProjectModel.updateProject.mockResolvedValue({ id: 1, name: "P2" });

      const result = await ProjectService.updateProject(1, "P2", "desc", 1, []);
      expect(result).toEqual({ id: 1, name: "P2" });
    });

    it("should throw validation error on update", async () => {
      projectSchema.validate.mockReturnValue({
        error: new Error("Invalid data"),
      });

      await expect(
        ProjectService.updateProject(1, "", "", null, []),
      ).rejects.toThrow(
        "Error al actualizar el proyecto: Datos inválidos: Invalid data",
      );
    });
  });

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      deleteProjectSchema.validate.mockReturnValue({ value: { id: 1 } });
      ProjectModel.deleteProject.mockResolvedValue(true);

      const result = await ProjectService.deleteProject(1);
      expect(result).toBe(true);
    });

    it("should throw validation error on delete", async () => {
      deleteProjectSchema.validate.mockReturnValue({
        error: new Error("Invalid ID"),
      });

      await expect(ProjectService.deleteProject(null)).rejects.toThrow(
        "Error al eliminar el proyecto: Datos inválidos: Invalid ID",
      );
    });
  });

  describe("getAllProjects", () => {
    it("should return formatted project list", async () => {
      ProjectModel.getAllProjects.mockResolvedValue([
        {
          id: 1,
          name: "P1",
          description: "test",
          company_id: 5,
          nodes: [],
          companies: {
            id: 5,
            name: "TestCompany",
          },
        },
      ]);

      const result = await ProjectService.getAllProjects();
      expect(result).toEqual([
        {
          id: 1,
          name: "P1",
          description: "test",
          companyId: 5,
          nodes: [],
          company: {
            id: 5,
            name: "TestCompany",
          },
        },
      ]);
    });
  });
});
