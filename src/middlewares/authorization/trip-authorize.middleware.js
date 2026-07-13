import AppError from "../../errors/AppError.js";
import tripMemberRepository from "../../repositories/trip-member.repository.js";

import {
  USER_ROLE,
  TRIP_MEMBER_ROLE,
  TRIP_MEMBER_STATUS,
} from "../../constants/enum.js";

const tripAuthorize = (...allowedRoles) => {
  return async (req, res, next) => {
    const user = req.user;

    if (user.role === USER_ROLE.ADMIN) {
      return next();
    }

    const { tripId } = req.params;

    const tripMember = await tripMemberRepository.findActiveMember(
      tripId,
      user.id,
    );
    if (!tripMember) {
      throw new AppError("You are not a member of this trip", 403);
    }

    if (!allowedRoles.includes(tripMember.tripRole)) {
      throw new AppError("You are not authorized to perform this action", 403);
    }

    req.tripMember = tripMember;
    next();
  };
};

export default tripAuthorize;
