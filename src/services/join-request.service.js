import sequelize from "../config/db.js";

import joinRequestRepository from "../repositories/join-request.repository.js";
import tripRepository from "../repositories/trip.repository.js";
import tripMemberRepository from "../repositories/trip-member.repository.js";
import { toJoinRequestResponse } from "../mappers/index.js";

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
        "You already have a pending request for this trip",
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

    const createdRequest = await joinRequestRepository.findDetailsById(
      request.id,
    );

    return toJoinRequestResponse(createdRequest);
  }

  async getPendingRequests(tripId) {
    const trip = await tripRepository.findById(tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const requests =
      await joinRequestRepository.findPendingRequestsByTrip(tripId);

    return requests.map(toJoinRequestResponse);
  }

  async approve(joinRequest, reviewerId) {
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

      const updatedRequest = await joinRequestRepository.findDetailsById(
        joinRequest.id,
      );

      return toJoinRequestResponse(updatedRequest);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async reject(joinRequest, reviewerId, responseMessage) {
    if (joinRequest.status !== REQUEST_STATUS.PENDING) {
      throw new AppError("Only pending requests can be rejected", 400);
    }

    joinRequest.status = REQUEST_STATUS.REJECTED;
    joinRequest.reviewedBy = reviewerId;
    joinRequest.reviewedAt = new Date();
    joinRequest.responseMessage = responseMessage ?? null;

    await joinRequestRepository.update(joinRequest);

    const updatedRequest = await joinRequestRepository.findDetailsById(
      joinRequest.id,
    );

    return toJoinRequestResponse(updatedRequest);
  }

  async cancel(joinRequestId, userId) {
    const joinRequest = await joinRequestRepository.findById(joinRequestId);

    if (!joinRequest) {
      throw new AppError("Join request not found", 404);
    }

    if (joinRequest.userId !== userId) {
      throw new AppError("You can only cancel your own join request", 403);
    }

    if (joinRequest.status !== REQUEST_STATUS.PENDING) {
      throw new AppError("Only pending requests can be cancelled", 400);
    }

    joinRequest.status = REQUEST_STATUS.CANCELLED;

    await joinRequestRepository.update(joinRequest);

    const updatedRequest = await joinRequestRepository.findDetailsById(
      joinRequest.id,
    );

    return toJoinRequestResponse(updatedRequest);
  }
}

export default new JoinRequestService();
