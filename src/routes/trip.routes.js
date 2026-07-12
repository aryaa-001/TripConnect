import { Router } from "express";

import authenticate from "../middlewares/authenticate.middleware.js";

import tripController from "../controllers/trip.controlle.js";
import joinRequestController from "../controllers/join-request.controller.js";
import { createTripValidator } from "../validators/trip.validator.js";
import { createJoinRequestValidator } from "../validators/join-request.validator.js";

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

export default router;
