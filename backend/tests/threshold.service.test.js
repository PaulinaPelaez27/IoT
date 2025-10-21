const { ThresholdService } = require("../src/services/threshold.service");
const { ThresholdModel } = require("../src/models/threshold.model");

jest.mock("../src/models/threshold.model");

describe("ThresholdService", () => {
  describe("createThreshold", () => {
    it("should create a new threshold", async () => {
      const mockData = { name: "High Temp", value: 50 };
      const mockResponse = { id: 1, ...mockData };

      ThresholdModel.createThreshold.mockResolvedValue(mockResponse);

      const result = await ThresholdService.createThreshold(mockData);
      expect(result).toEqual(mockResponse);
      expect(ThresholdModel.createThreshold).toHaveBeenCalledWith(mockData);
    });
  });

  describe("getThresholdById", () => {
    it("should return threshold by ID", async () => {
      const mockThreshold = { id: 1, name: "Critical", value: 80 };
      ThresholdModel.getThresholdById.mockResolvedValue(mockThreshold);

      const result = await ThresholdService.getThresholdById(1);
      expect(result).toEqual(mockThreshold);
      expect(ThresholdModel.getThresholdById).toHaveBeenCalledWith(1);
    });
  });

  describe("getAllThresholds", () => {
    it("should return all thresholds", async () => {
      const mockList = [
        { id: 1, name: "Critical", value: 80 },
        { id: 2, name: "Warning", value: 60 },
      ];
      ThresholdModel.getAllThresholds.mockResolvedValue(mockList);

      const result = await ThresholdService.getAllThresholds();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Critical");
      expect(ThresholdModel.getAllThresholds).toHaveBeenCalled();
    });
  });

  describe("updateThreshold", () => {
    it("should update a threshold", async () => {
      const updatedData = { name: "New Name", value: 75 };
      const updatedResponse = { id: 1, ...updatedData };

      ThresholdModel.updateThreshold.mockResolvedValue(updatedResponse);

      const result = await ThresholdService.updateThreshold(1, updatedData);
      expect(result).toEqual(updatedResponse);
      expect(ThresholdModel.updateThreshold).toHaveBeenCalledWith(
        1,
        updatedData,
      );
    });
  });

  describe("deleteThreshold", () => {
    it("should delete a threshold by ID", async () => {
      ThresholdModel.deleteThreshold.mockResolvedValue({ success: true });

      const result = await ThresholdService.deleteThreshold(1);
      expect(result.success).toBe(true);
      expect(ThresholdModel.deleteThreshold).toHaveBeenCalledWith(1);
    });
  });
});
