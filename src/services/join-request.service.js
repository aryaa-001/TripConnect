import joinRequestRepository from "../repositories/join-request.repository.js";
import tripRepository from "../repositories/trip.repository.js";
import tripMemberRepository from "../repositories/trip-member.repository.js";
import AppError from "../errors/AppError.js";

import {
  REQUEST_STATUS,
  REGISTRATION_STATUS,
  TRIP_STATUS,
  TRIP_MEMBER_STATUS,
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
}

export default new JoinRequestService();
