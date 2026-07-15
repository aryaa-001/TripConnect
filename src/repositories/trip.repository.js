import { Trip } from "../models/index.js";

class TripRepository {
  async create(tripData, options = {}) {
    return await Trip.create(tripData, options);
  }

  async findById(tripId) {
    return await Trip.findByPk(tripId);
  }

  async gettAll(){
    return await Trip.findAll();
  }

  async update(trip) {
    return await trip.save();
}
}

export default new TripRepository();
