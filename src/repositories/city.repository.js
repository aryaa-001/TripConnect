import { City } from "../models/index.js";

class CityRepository {
  async create(data) {
    return await City.create(data);
  }

  async findByName(name) {
    return await City.findOne({
      where: { name },
    });
  }
}

export default new CityRepository();
