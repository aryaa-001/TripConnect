import { body, param } from "express-validator";
import validate from "../middlewares/validate.js";

export const createJoinRequestValidator = [
  body("message")
    .optional()
    .isString()
    .withMessage("Message must be a string")
    .trim()
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),

  validate,
];

export const getPendingRequestsValidator = [
  param("tripId").isUUID().withMessage("Invalid trip id"),

  validate,
];

export const approveJoinRequestValidator = [
  param("id").isUUID().withMessage("Invalid join request id"),

  validate,
];
