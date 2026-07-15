import { Router } from "express";

import authenticate from "../middlewares/authenticate.middleware.js";
import platformAuthorize from "../middlewares/authorization/platform-authorize.middleware.js";
import tripAuthorize from "../middlewares/authorization/trip-authorize.middleware.js";
import joinRequestAuthorize from "../middlewares/authorization/join-request-authorize.middleware.js";

import tripController from "../controllers/trip.controlle.js";
import joinRequestController from "../controllers/join-request.controller.js";
import {
  createTripValidator,
  findTripValidator,
  updateTripValidator,
} from "../validators/trip.validator.js";
import {
  createJoinRequestValidator,
  rejectJoinRequestValidator,
} from "../validators/join-request.validator.js";

import { USER_ROLE, TRIP_MEMBER_ROLE } from "../constants/enum.js";
import { globalUuidValidator } from "../validators/comman/uuid.validator.js";

const router = Router();

router.get(
  "/",
  authenticate,
  platformAuthorize(USER_ROLE.ADMIN),
  tripController.getAllTrips,
);

router.post(
  "/create",
  authenticate,
  createTripValidator,
  tripController.create,
);

router.get("/:id", authenticate, globalUuidValidator, tripController.getById);

//Update trip info using trip Id
router.patch(
  "/:id",
  authenticate,
  globalUuidValidator,
  updateTripValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(TRIP_MEMBER_ROLE.ORGANIZER, TRIP_MEMBER_ROLE.MODERATOR),
  tripController.update,
);

// join-request flow (make request, see all request, reject, approve, cancelled by user)
router.post(
  "/:id/join-request",
  authenticate,
  createJoinRequestValidator,
  joinRequestController.create,
);

router.get(
  "/:id/pending-join-requests",
  authenticate,
  globalUuidValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  tripAuthorize(TRIP_MEMBER_ROLE.ORGANIZER, TRIP_MEMBER_ROLE.MODERATOR),
  joinRequestController.getPendingRequests,
);

router.patch(
  "/pending-join-request/:id/approve",
  authenticate,
  globalUuidValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  joinRequestAuthorize(TRIP_MEMBER_ROLE.ORGANIZER, TRIP_MEMBER_ROLE.MODERATOR),
  joinRequestController.approve,
);

router.patch(
  "/join-request/:id/reject",
  authenticate,
  rejectJoinRequestValidator,
  platformAuthorize(USER_ROLE.ADMIN, USER_ROLE.USER),
  joinRequestAuthorize(TRIP_MEMBER_ROLE.ORGANIZER, TRIP_MEMBER_ROLE.MODERATOR),
  joinRequestController.reject,
);

router.patch(
  "/join-request/:id/cancel",
  authenticate,
  globalUuidValidator,
  joinRequestController.cancel,
);

export default router;
