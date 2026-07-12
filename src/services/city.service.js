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
}

export default new CityService();
