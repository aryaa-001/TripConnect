import { Trip } from "../models/index.js";
import {
  USER_PUBLIC_ATTRIBUTES,
  CITY_PUBLIC_ATTRIBUTES,
} from "../constants/model-attributes.js";

import { TRIP_MEMBER_STATUS } from "../constants/enum.js";

class TripRepository {
  async create(tripData, options = {}) {
    return await Trip.create(tripData, options);
  }

  async findById(tripId) {
    return await Trip.findByPk(tripId);
  }

  async findDetailsById(tripId) {
    return await Trip.findByPk(tripId, {
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
    });
  }

  async getAll({ limit, offset, where, order } = {}) {
    return await Trip.findAndCountAll({
      limit,
      offset,
      where,
      order,

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
    });
  }

  async getAllForLifecycle() {
    return await Trip.findAll({
      include: [
        {
          association: "members",
          where: {
            status: TRIP_MEMBER_STATUS.ACTIVE,
          },
          required: false,
        },
      ],
    });
  }

  async updateLifecycle(id, data) {
    return await Trip.update(data, {
      where: { id },
    });
  }

  async update(trip) {
    return await trip.save();
  }
}

export default new TripRepository();
