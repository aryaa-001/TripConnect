import cityService from "../services/city.service.js";
import successResponse from "../utils/response.js";

class CityController {
  async create(req, res) {
    const city = await cityService.create(req.body);

    return successResponse(res, {
      status: 201,
      message: "City created successfully",
      data: city,
    });
  }

  async getAll(req, res) {
    const cities = await cityService.getAllCities();

    return successResponse(res, {
      message: "Cities fetched successfully",
      data: cities,
    });
  }
}

export default new CityController();