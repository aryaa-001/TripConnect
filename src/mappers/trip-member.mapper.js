import { toUserProfileResponse } from "./user.mapper.js";

const toTripMemberResponse = (tripMember) => {
  return {
    tripRole: tripMember.tripRole,
    status: tripMember.status,
    joinedAt: tripMember.joinedAt,

    user: tripMember.user ? toUserProfileResponse(tripMember.user) : undefined,
  };
};

export { toTripMemberResponse };
