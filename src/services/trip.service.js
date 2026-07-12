import sequelize from "../config/db.js";

import tripRepository from "../repositories/trip.repository.js";
import tripMemberRepository from "../repositories/trip-member.repository.js";

import { TRIP_MEMBER_ROLE, TRIP_MEMBER_STATUS } from "../constants/enum.js";

class TripService {
  async create(tripData, userId) {
    const transaction = await sequelize.transaction();

    try {
      const data = {
        ...tripData,
        createdBy: userId,
      };

      const trip = await tripRepository.create(data, {
        transaction,
      });

      await tripMemberRepository.create(
        {
          tripId: trip.id,
          userId,
          tripRole: TRIP_MEMBER_ROLE.ORGANIZER,
          status: TRIP_MEMBER_STATUS.ACTIVE,
        },
        {
          transaction,
        },
      );

      await transaction.commit();

      return trip;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new TripService();
