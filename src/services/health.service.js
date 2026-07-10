import AppError from "../errors/AppError.js";

class HealthService {
  getHealthStatus() {
    return {
      success: true,
      message: "Server is healthy",
    };
  }
}

export default new HealthService();
