import { Router } from "express";

import authenicate from "../middlewares/authenticate.middleware.js";
import platformAuthorize from "../middlewares/authorization/platform-authorize.middleware.js";
import tripAuthorize from "../middlewares/authorization/trip-authorize.middleware.js";

import { USER_ROLE, TRIP_MEMBER_ROLE } from "../constants/enum.js";

import { tripIdandMemberIdValidator } from "../validators/trip-member.validator.js";
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
  "/trip/:tripId/members/:tripMemberId",
  authenicate,
  tripIdandMemberIdValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(TRIP_MEMBER_ROLE.ORGANIZER, TRIP_MEMBER_ROLE.MODERATOR),
  tripMemberController.removeMember,
);

router.patch(
  "/trip/:tripId/members/:tripMemberId/promote",
  authenicate,
  tripIdandMemberIdValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(TRIP_MEMBER_ROLE.ORGANIZER),
  tripMemberController.promoteMember,
);

router.patch(
  "/trip/:tripId/members/:tripMemberId/demote",
  authenicate,
  tripIdandMemberIdValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(TRIP_MEMBER_ROLE.ORGANIZER),
  tripMemberController.demoteMember,
);

export default router;
