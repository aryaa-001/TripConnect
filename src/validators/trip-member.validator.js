import { param } from "express-validator";
import validate from "../middlewares/validate.js";

export const removeMemberValidator = [
  param("tripId").isUUID().withMessage("Invalid trip id"),

  param("memberId").isUUID().withMessage("Invalid member id"),

  validate,
];
