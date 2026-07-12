import { body } from "express-validator";
import validate from "../middlewares/validate.js";
import { TRIP_VISIBILITY } from "../constants/enum.js";

export const createTripValidator = [
  // Basic Information
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .isString()
    .withMessage("Description must be a string")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 1000 characters"),

  // Trip Schedule
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),

  body("registrationDeadline")
    .notEmpty()
    .withMessage("Registration deadline is required")
    .isISO8601()
    .withMessage("Registration deadline must be a valid date"),

  // Location
  body("departureCityId")
    .notEmpty()
    .withMessage("Departure city is required")
    .isUUID(4)
    .withMessage("Departure city must be a valid UUID"),

  body("meetingPoint")
    .optional()
    .isString()
    .withMessage("Meeting point must be a string")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Meeting point must be between 5 and 200 characters"),

  // Trip Details
  body("estimatedCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated cost must be a positive number"),

  body("maxMembers")
    .notEmpty()
    .withMessage("Maximum members is required")
    .isInt({ min: 2, max: 50 })
    .withMessage("Maximum members must be between 2 and 50"),

  body("visibility")
    .optional()
    .isIn(Object.values(TRIP_VISIBILITY))
    .withMessage("Invalid trip visibility"),

  validate,
];
