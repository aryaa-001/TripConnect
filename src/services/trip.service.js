import sequelize from "../config/db.js";
import AppError from "../errors/AppError.js";

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

  async getById(id) {
    const trip = await tripRepository.findById(id);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    return trip;
  }

  async getAllTrips() {
    const trips = await tripRepository.gettAll();

    if (!trips) {
      throw new AppError("Trips not found", 404);
    }

    return trips;
  }

  async update(tripId, updateData) {
    const trip = await tripRepository.findById(tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const activeMembers = await tripMemberRepository.countActiveMembers(tripId);
    if (updateData.maxMembers && updateData.maxMembers < activeMembers) {
      throw new AppError(
        "Maximum members cannot be less than current active members",
        400,
      );
    }

    const startDate = new Date(updateData.startDate ?? trip.startDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate =
      updateData.endDate !== undefined ? updateData.endDate : trip.endDate;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    if (startDate < todayDate) {
      throw new AppError("Trip start date cannot be in the past", 400);
    }

    if (endDate) {
      const parsedEndDate = new Date(endDate);
      parsedEndDate.setHours(0, 0, 0, 0);

      if (parsedEndDate < startDate) {
        throw new AppError("End date cannot be before the start date", 400);
      }
    }

    const registrationDeadline =
      updateData.registrationDeadline ?? trip.registrationDeadline;

    if (registrationDeadline > startDate) {
      throw new AppError(
        "Registration deadline must be before the trip start date",
        400,
      );
    }

    Object.assign(trip, updateData);

    return await tripRepository.update(trip);
  }
}

export default new TripService();
