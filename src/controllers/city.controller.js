import cityService from "../services/city.service.js";

class CityController {
  async create(req, res) {
    const city = await cityService.create(req.body);

    return res.status(201).json({
      success: true,
      message: "City created successfully",
      data: city,
    });
  }

  async getALl(req, res) {
    const cities = await cityService.getAllCities();

    return res.status(200).json({
      success: true,
      data: cities,
    });
  }
}

export default new CityController();
