import { Router } from "express";

import authenicate from "../middlewares/authenticate.middleware.js";
import platformAuthorize from "../middlewares/authorization/platform-authorize.middleware.js";
import tripAuthorize from "../middlewares/authorization/trip-authorize.middleware.js";

import { USER_ROLE, TRIP_MEMBER_ROLE } from "../constants/enum.js";

import { removeMemberValidator } from "../validators/trip-member.validator.js";
import { globalUuidValidator } from "../validators/comman/uuid.validator.js";

import tripMemberController from "../controllers/trip-member.controller.js";

const router = Router();

router.get(
  "/trip/:id/members",
  authenicate,
  globalUuidValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(
    TRIP_MEMBER_ROLE.ORGANIZER,
    TRIP_MEMBER_ROLE.MODERATOR,
    TRIP_MEMBER_ROLE.MEMBER,
  ),
  tripMemberController.getMembers,
);

router.delete(
  "/trip/:id/members/me",
  authenicate,
  globalUuidValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(
    TRIP_MEMBER_ROLE.ORGANIZER,
    TRIP_MEMBER_ROLE.MODERATOR,
    TRIP_MEMBER_ROLE.MEMBER,
  ),
  tripMemberController.leaveTrip,
);

router.delete(
  "/trip/:tripId/members/:memberId",
  authenicate,
  removeMemberValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(TRIP_MEMBER_ROLE.ORGANIZER, TRIP_MEMBER_ROLE.MODERATOR),
  tripMemberController.removeMember,
);

export default router;
