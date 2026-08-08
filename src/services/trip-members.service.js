import AppError from "../errors/AppError.js";
import tripMemberRepository from "../repositories/trip-member.repository.js";
import tripRepository from "../repositories/trip.repository.js";

import { TRIP_MEMBER_ROLE, TRIP_MEMBER_STATUS } from "../constants/enum.js";
import { toTripMemberResponse } from "../mappers/index.js";

class TripMemberService {
  async getMembers(tripId) {
    const trip = await tripRepository.findById(tripId);

    if (!trip) {
      throw new AppError("Trip not found", 404);
    }

    const tripMembers =
      await tripMemberRepository.findActiveMembersByTrip(tripId);

    return tripMembers.map(toTripMemberResponse);
  }

  async getActiveTripMember(tripId, tripMemberId) {
    const tripMember = await tripMemberRepository.findByIdAndTrip(
      tripId,
      tripMemberId,
    );

    if (!tripMember) {
      throw new AppError("Trip member not found", 404);
    }

    if (tripMember.status !== TRIP_MEMBER_STATUS.ACTIVE) {
      throw new AppError("Trip member is not active", 400);
    }

    return tripMember;
  }

  async removeMember(tripId, tripMemberId, reviewer) {
    const member = await this.getActiveTripMember(tripMemberId, tripId);

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

    await tripMemberRepository.update(member);

    const updatedMember = await tripMemberRepository.findDetailsById(member.id);

    return toTripMemberResponse(updatedMember);
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

    await tripMemberRepository.update(tripMember);

    const updatedMember = await tripMemberRepository.findDetailsById(
      tripMember.id,
    );

    return toTripMemberResponse(updatedMember);
  }

  async promoteMember(tripId, tripMemberId) {
    const member = await this.getActiveTripMember(tripId, tripMemberId);

    if (member.tripRole === TRIP_MEMBER_ROLE.ORGANIZER) {
      throw new AppError("Organizer cannot be a moderator", 403);
    }

    if (member.tripRole === TRIP_MEMBER_ROLE.MODERATOR) {
      throw new AppError("Member is already a moderator", 403);
    }

    member.tripRole = TRIP_MEMBER_ROLE.MODERATOR;

    await tripMemberRepository.update(member);

    const updatedMember = await tripMemberRepository.findDetailsById(member.id);

    return toTripMemberResponse(updatedMember);
  }

  async demoteMember(tripId, tripMemberId) {
    const member = await this.getActiveTripMember(tripMemberId, tripId);

    if (member.tripRole === TRIP_MEMBER_ROLE.ORGANIZER) {
      throw new AppError("Organizer cannot be demoted", 403);
    }

    if (member.tripRole === TRIP_MEMBER_ROLE.MEMBER) {
      throw new AppError("Member is already a regular member", 400);
    }

    member.tripRole = TRIP_MEMBER_ROLE.MEMBER;

    await tripMemberRepository.update(member);

    const updatedMember = await tripMemberRepository.findDetailsById(member.id);

    return toTripMemberResponse(updatedMember);
  }
}

export default new TripMemberService();
