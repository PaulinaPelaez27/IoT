// src/tests/alertService.test.js
const { AlertService } = require("../src/services/alert.service");
const { AlertModel } = require("../src/models/alert.model");

jest.mock("../src/models/alert.model");

describe("AlertService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createAlert", () => {
    it("returns the created alert", async () => {
      const payload = { name: "Overheat", value: 80 };
      AlertModel.createAlert.mockResolvedValue({ id: 1, ...payload });

      const result = await AlertService.createAlert(payload);

      expect(AlertModel.createAlert).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ id: 1, ...payload });
    });

    it("propagates the error on failure", async () => {
      AlertModel.createAlert.mockRejectedValue(new Error("DB down"));

      await expect(AlertService.createAlert({})).rejects.toThrow(
        "Error creating alert: DB down",
      );
    });
  });

  describe("getAlertById", () => {
    it("returns the corresponding alert", async () => {
      AlertModel.getAlertById.mockResolvedValue({ id: 1, name: "LowBattery" });

      const result = await AlertService.getAlertById(1);

      expect(AlertModel.getAlertById).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, name: "LowBattery" });
    });

    it("propagates the error if the request fails", async () => {
      AlertModel.getAlertById.mockRejectedValue(new Error("not found"));

      await expect(AlertService.getAlertById(99)).rejects.toThrow(
        "Error fetching alert by ID: not found",
      );
    });
  });

  describe("getAllAlerts", () => {
    it("returns the list of alerts", async () => {
      const list = [{ id: 1 }, { id: 2 }];
      AlertModel.getAllAlerts.mockResolvedValue(list);

      const result = await AlertService.getAllAlerts();

      expect(AlertModel.getAllAlerts).toHaveBeenCalled();
      expect(result).toEqual(list);
    });

    it("propagates the error if the request fails", async () => {
      AlertModel.getAllAlerts.mockRejectedValue(new Error("timeout"));

      await expect(AlertService.getAllAlerts()).rejects.toThrow(
        "Error fetching all alerts: timeout",
      );
    });
  });

  describe("updateAlert", () => {
    it("returns the updated alert", async () => {
      const updated = { id: 1, name: "Updated" };
      AlertModel.updateAlert.mockResolvedValue(updated);

      const result = await AlertService.updateAlert(1, { name: "Updated" });

      expect(AlertModel.updateAlert).toHaveBeenCalledWith(1, {
        name: "Updated",
      });
      expect(result).toEqual(updated);
    });

    it("propagates the error if the update fails", async () => {
      AlertModel.updateAlert.mockRejectedValue(new Error("write denied"));

      await expect(AlertService.updateAlert(1, { name: "X" })).rejects.toThrow(
        "Error updating alert: write denied",
      );
    });
  });

  describe("deleteAlert", () => {
    it("returns the result of the deletion", async () => {
      AlertModel.deleteAlert.mockResolvedValue({ count: 1 });

      const result = await AlertService.deleteAlert(1);

      expect(AlertModel.deleteAlert).toHaveBeenCalledWith(1);
      expect(result).toEqual({ count: 1 });
    });

    it("propagates the error if the deletion fails", async () => {
      AlertModel.deleteAlert.mockRejectedValue(new Error("constraint"));

      await expect(AlertService.deleteAlert(1)).rejects.toThrow(
        "Error deleting alert: constraint",
      );
    });
  });
});
