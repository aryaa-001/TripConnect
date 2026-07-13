import { Router } from "express";

import authenticate from "../middlewares/authenticate.middleware.js";
import platformAuthorize from "../middlewares/authorization/platform-authorize.middleware.js";
import tripAuthorize from "../middlewares/authorization/trip-authorize.middleware.js";
import joinRequestAuthorize from "../middlewares/authorization/join-request-authorize.middleware.js";

import tripController from "../controllers/trip.controlle.js";
import joinRequestController from "../controllers/join-request.controller.js";
import { createTripValidator } from "../validators/trip.validator.js";
import {
  createJoinRequestValidator,
  getPendingRequestsValidator,
  approveJoinRequestValidator,
} from "../validators/join-request.validator.js";

import { USER_ROLE, TRIP_MEMBER_ROLE } from "../constants/enum.js";

const router = Router();

router.post(
  "/create",
  authenticate,
  createTripValidator,
  tripController.create,
);

router.post(
  "/:tripId/join-requests",
  authenticate,
  createJoinRequestValidator,
  joinRequestController.create,
);

router.get(
  "/:tripId/pending-join-requests",
  authenticate,
  getPendingRequestsValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(TRIP_MEMBER_ROLE.ORGANIZER, TRIP_MEMBER_ROLE.MODERATOR),
  joinRequestController.getPendingRequests,
);

router.patch(
  "/pending-join-requests/:id/approve",
  authenticate,
  approveJoinRequestValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  joinRequestAuthorize(TRIP_MEMBER_ROLE.ORGANIZER, TRIP_MEMBER_ROLE.MODERATOR),
  joinRequestController.approve,
);

export default router;
