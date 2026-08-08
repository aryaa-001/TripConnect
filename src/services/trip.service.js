import { Op } from "sequelize";
import sequelize from "../config/db.js";
import AppError from "../errors/AppError.js";

import tripRepository from "../repositories/trip.repository.js";
import tripMemberRepository from "../repositories/trip-member.repository.js";

import { TRIP_MEMBER_ROLE, TRIP_MEMBER_STATUS } from "../constants/enum.js";
import { ALLOWED_ORDER, ALLOWED_SORT_FIELDS } from "../constants/trip.js";
import {
  toTripDetailsResponse,
  toTripSummaryResponse,
} from "../mappers/index.js";

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

      const createdTrip = await tripRepository.findDetailsById(trip.id);

      const activeMembersCount = await tripMemberRepository.countActiveMembers(
        trip.id,
      );

      const availableSeats = createdTrip.maxMembers - activeMembersCount;

      return toTripDetailsResponse({
        ...createdTrip.toJSON(),
        activeMembersCount,
        availableSeats,
      });
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

  async getDetailsById(id) {
    const trip = await tripRepository.findDetailsById(id);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const activeMembersCount =
      await tripMemberRepository.countActiveMembers(id);

    const availableSeats = trip.maxMembers - activeMembersCount;

    return toTripDetailsResponse({
      ...trip.toJSON(),
      activeMembersCount,
      availableSeats,
    });
  }

  async getAllTrips(query) {
    const where = {};
    const page = query.page === undefined ? 1 : Number(query.page);
    const limit = query.limit === undefined ? 10 : Number(query.limit);

    if (Number.isNaN(page)) {
      throw new AppError("Page must be a number", 400);
    }
    if (Number.isNaN(limit)) {
      throw new AppError("Limit must be a number", 400);
    }

    if (page < 1) {
      throw new AppError("Page must be greater than 0", 400);
    }

    if (limit < 1) {
      throw new AppError("Limit must be greater than 0", 400);
    }

    if (query.search) {
      where[Op.or] = [
        {
          title: {
            [Op.iLike]: `%${query.search}%`,
          },
        },
      ];
    }

    if (query.departureCityId) {
      where.departureCityId = query.departureCityId;
    }

    const { startDateFrom, startDateTo } = query;

    if (startDateFrom && Number.isNaN(Date.parse(startDateFrom))) {
      throw new AppError("Invalid startDateFrom", 400);
    }

    if (startDateTo && Number.isNaN(Date.parse(startDateTo))) {
      throw new AppError("Invalid startDateTo", 400);
    }

    if (
      startDateFrom &&
      startDateTo &&
      new Date(startDateFrom) > new Date(startDateTo)
    ) {
      throw new AppError("startDateFrom cannot be after startDateTo", 400);
    }

    if (startDateFrom && startDateTo) {
      where.startDate = {
        [Op.between]: [startDateFrom, startDateTo],
      };
    } else if (startDateFrom) {
      where.startDate = {
        [Op.gte]: startDateFrom,
      };
    } else if (startDateTo) {
      where.startDate = {
        [Op.lte]: startDateTo,
      };
    }

    const { sort, order } = query;

    if (sort && !ALLOWED_SORT_FIELDS.includes(sort)) {
      throw new AppError("Invalid sort field", 400);
    }

    const sortOrder = order ? order.toUpperCase() : "DESC";

    if (!ALLOWED_ORDER.includes(sortOrder)) {
      throw new AppError("Invalid sort order", 400);
    }

    let sequelizeOrder;

    sort
      ? (sequelizeOrder = [[sort, sortOrder]])
      : (sequelizeOrder = [["createdAt", "DESC"]]);

    const offset = (page - 1) * limit;
    const { rows, count } = await tripRepository.getAll({
      limit,
      offset,
      where,
      order: sequelizeOrder,
    });

    return {
      trips: rows.map(toTripSummaryResponse),

      pagination: {
        page,
        limit,
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
      },
    };
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

    await tripRepository.update(trip);

    const updatedTrip = await tripRepository.findDetailsById(trip.id);

    const activeMembersCount = await tripMemberRepository.countActiveMembers(
      trip.id,
    );

    const availableSeats = updatedTrip.maxMembers - activeMembersCount;

    return toTripDetailsResponse({
      ...updatedTrip.toJSON(),
      activeMembersCount,
      availableSeats,
    });
  }
}

export default new TripService();
