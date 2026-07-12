import { Trip } from "../models/index.js";

class TripRepository {
  async create(tripData, options = {}) {
    return await Trip.create(tripData, options);
  }

  async findById(tripId) {
    return await Trip.findByPk(tripId);
  }
}

export default new TripRepository();
