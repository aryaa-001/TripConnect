import AppError from "../errors/AppError.js";
import cityRepository from "../repositories/city.repository.js";
import { toCityResponse } from "../mappers/index.js";

class CityService {
  async create(data) {
    const isExisting = await cityRepository.findByName(data.name);
    if (isExisting) {
      throw new AppError("City already exist", 409);
    }
    const city = await cityRepository.create(data);
    return toCityResponse(city);
  }

  async getAllCities() {
    const cities = await cityRepository.findAll();

    return cities.map(toCityResponse);
  }
}

export default new CityService();
