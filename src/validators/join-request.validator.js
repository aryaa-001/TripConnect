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
  param("id").isUUID().withMessage("Invalid uuid id"),

  validate,
];

export const rejectJoinRequestValidator = [
  body("responseMessage")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Response message cannot exceed 500 characters"),
  param("id").isUUID().withMessage("Invalid uuid id"),

  validate,
];
