import { Trip } from "../models/index.js";
import {
  USER_PUBLIC_ATTRIBUTES,
  CITY_PUBLIC_ATTRIBUTES,
} from "../constants/model-attributes.js";

class TripRepository {
  async create(tripData, options = {}) {
    return await Trip.create(tripData, options);
  }

  async findById(tripId) {
    return await Trip.findByPk(tripId);
  }

  async getAll({ limit, offset } = {}) {
    return await Trip.findAndCountAll({
      limit,
      offset,

      include: [
        {
          association: "creator",
          attributes: USER_PUBLIC_ATTRIBUTES,
        },
        {
          association: "city",
          attributes: CITY_PUBLIC_ATTRIBUTES,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async update(trip) {
    return await trip.save();
  }
}

export default new TripRepository();
