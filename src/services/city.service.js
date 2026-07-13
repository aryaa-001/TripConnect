import cityRepository from "../repositories/city.repository.js";
import AppError from "../errors/AppError.js";

class CityService {
  async create(data) {
    const isExisting = await cityRepository.findByName(data.name);
    if (isExisting) {
      throw new AppError("City already exist", 409);
    }
    return await cityRepository.create(data);
  }

  async getAllCities(id) {
    const cities = await cityRepository.findAll();

    if (!cities) {
      throw new AppError("Cities not found", 404);
    }

    return city;
  }
}

export default new CityService();
