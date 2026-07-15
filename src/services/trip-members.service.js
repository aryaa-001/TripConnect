import AppError from "../errors/AppError.js";
import tripMemberRepository from "../repositories/trip-member.repository.js";
import tripRepository from "../repositories/trip.repository.js";

import { TRIP_MEMBER_ROLE, TRIP_MEMBER_STATUS } from "../constants/enum.js";

class TripMemberService {
  async getMembers(tripId) {
    const trip = await tripRepository.findById(tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    return await tripMemberRepository.findActiveMembersByTrip(tripId);
  }

  async removeMember(tripId, memberId, reviewer) {
    const member = await tripMemberRepository.findByIdAndTrip(tripId, memberId);

    if (!member) {
      throw new AppError("Trip member not found", 404);
    }

    if (member.status !== TRIP_MEMBER_STATUS.ACTIVE) {
      throw new AppError("Member is no longer active", 400);
    }

    if (member.tripRole === TRIP_MEMBER_ROLE.ORGANIZER) {
      throw new AppError("Organizer cannot be removed", 403);
    }

    if (
      reviewer.tripRole === TRIP_MEMBER_ROLE.MODERATOR &&
      member.tripRole !== TRIP_MEMBER_ROLE.MEMBER
    ) {
      throw new AppError("Moderators can only remove members", 403);
    }

    if (reviewer.userId === member.userId) {
      throw new AppError("Use the leave option to leave the trip", 400);
    }

    member.status = TRIP_MEMBER_STATUS.REMOVED;
    return await tripMemberRepository.update(member);
  }

  async leaveTrip(tripMember) {
    if (tripMember.tripRole === TRIP_MEMBER_ROLE.ORGANIZER) {
      throw new AppError("Organizer cannot leave the trip", 403);
    }

    if (tripMember.status !== TRIP_MEMBER_STATUS.ACTIVE) {
      throw new AppError(
        "You are no longer an active member of this trip",
        400,
      );
    }

    tripMember.status = TRIP_MEMBER_STATUS.LEFT;

    return await tripMemberRepository.update(tripMember);
  }
}

export default new TripMemberService();
