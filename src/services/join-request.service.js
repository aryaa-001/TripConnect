import sequelize from "../config/db.js";

import joinRequestRepository from "../repositories/join-request.repository.js";
import tripRepository from "../repositories/trip.repository.js";
import tripMemberRepository from "../repositories/trip-member.repository.js";
import AppError from "../errors/AppError.js";

import {
  REQUEST_STATUS,
  REGISTRATION_STATUS,
  TRIP_STATUS,
  TRIP_MEMBER_STATUS,
  TRIP_MEMBER_ROLE,
} from "../constants/enum.js";

class JoinRequestService {
  async requestToJoin(tripId, userId, message) {
    const trip = await tripRepository.findById(tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    if (trip.status !== TRIP_STATUS.PLANNED) {
      throw new AppError("You cannot join this trip", 400);
    }

    if (trip.registrationStatus !== REGISTRATION_STATUS.OPEN) {
      throw new AppError("Registration is closed", 400);
    }

    if (new Date() > new Date(trip.registrationDeadline)) {
      throw new AppError("Registration deadline has passed", 400);
    }

    const activeMember = await tripMemberRepository.findActiveMember(
      tripId,
      userId,
    );

    if (activeMember) {
      throw new AppError("You are already a member of this trip", 409);
    }

    const pendingRequest = await joinRequestRepository.findPendingRequest(
      tripId,
      userId,
    );

    if (pendingRequest) {
      throw new AppError(
        "You already have a pending request for this Trip",
        409,
      );
    }

    const activeMembers = await tripMemberRepository.countActiveMembers(tripId);

    if (activeMembers >= trip.maxMembers) {
      throw new AppError("Trip is already full", 400);
    }

    const request = await joinRequestRepository.create({
      tripId,
      userId,
      message,
    });

    return request;
  }

  async getPendingRequests(tripId, user) {
    const trip = await tripRepository.findById(tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    return await joinRequestRepository.findPendingRequestsByTrip(tripId);
  }

  async approve(joinRequest, reviewerId) {
    console.log(reviewerId)
    console.log(joinRequest)
    if (joinRequest.status !== REQUEST_STATUS.PENDING) {
      throw new AppError("Only pending requests can be approved", 400);
    }

    const trip = await tripRepository.findById(joinRequest.tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const activeMembers = await tripMemberRepository.countActiveMembers(
      trip.id,
    );

    if (activeMembers >= trip.maxMembers) {
      throw new AppError("Trip is already full", 400);
    }

    const existingMember = await tripMemberRepository.findActiveMember(
      trip.id,
      joinRequest.userId,
    );

    if (existingMember) {
      throw new AppError("User is already a member", 409);
    }

    const transaction = await sequelize.transaction();

    try {
      await tripMemberRepository.create(
        {
          tripId: trip.id,
          userId: joinRequest.userId,
          tripRole: TRIP_MEMBER_ROLE.MEMBER,
          status: TRIP_MEMBER_STATUS.ACTIVE,
        },
        {
          transaction,
        },
      );

      joinRequest.status = REQUEST_STATUS.APPROVED;
      joinRequest.reviewedBy = reviewerId;
      joinRequest.reviewedAt = new Date();

      await joinRequestRepository.update(joinRequest, {
        transaction,
      });

      await transaction.commit();

      return joinRequest;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export default new JoinRequestService();
