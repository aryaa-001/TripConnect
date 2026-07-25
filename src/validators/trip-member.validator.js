import { param } from "express-validator";
import validate from "../middlewares/validate.js";

export const tripIdandMemberIdValidator = [
  param("tripId").isUUID().withMessage("Invalid trip id"),

  param("tripMemberId").isUUID().withMessage("Invalid member id"),

  validate,
];