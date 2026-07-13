import AppError from "../../errors/AppError.js";

import joinRequestRepository from "../../repositories/join-request.repository.js";
import tripMemberRepository from "../../repositories/trip-member.repository.js";

import { USER_ROLE } from "../../constants/enum.js";

const joinRequestAuthorize = (...allowedRoles) => {
  return async (req, res, next) => {
    const user = req.user;

    const { id } = req.params;
    const joinRequest = await joinRequestRepository.findById(id);

    if (!joinRequest) {
      throw new AppError("Join request not found", 404);
    }

    req.joinRequest = joinRequest;

    if (user.role === USER_ROLE.ADMIN) {
      return next();
    }

    //Non-admin flow
    const tripMember = await tripMemberRepository.findActiveMember(
      joinRequest.tripId,
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

export default joinRequestAuthorize;
