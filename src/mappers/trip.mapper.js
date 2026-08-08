import { toUserProfileResponse } from "./user.mapper.js";
import { toCityResponse } from "./city.mapper.js";

const toTripSummaryResponse = (trip) => {
  return {
    id: trip.id,
    title: trip.title,
    startDate: trip.startDate,
    endDate: trip.endDate,
    estimatedCost: trip.estimatedCost,
    maxMembers: trip.maxMembers,
    status: trip.status,
    visibility: trip.visibility,
    registrationStatus: trip.registrationStatus,

    creator: trip.creator
      ? toUserProfileResponse(trip.creator)
      : undefined,

    departureCity: trip.city
      ? toCityResponse(trip.city)
      : undefined,
  };
};

const toTripDetailsResponse = (trip) => {
  return {
    id: trip.id,
    title: trip.title,
    description: trip.description,
    startDate: trip.startDate,
    endDate: trip.endDate,
    registrationDeadline: trip.registrationDeadline,
    meetingPoint: trip.meetingPoint,
    estimatedCost: trip.estimatedCost,
    maxMembers: trip.maxMembers,
    status: trip.status,
    visibility: trip.visibility,
    registrationStatus: trip.registrationStatus,

    activeMembersCount: trip.activeMembersCount,
    availableSeats: trip.availableSeats,

    creator: trip.creator
      ? toUserProfileResponse(trip.creator)
      : undefined,

    departureCity: trip.city
      ? toCityResponse(trip.city)
      : undefined,
  };
};

export {
  toTripSummaryResponse,
  toTripDetailsResponse,
};