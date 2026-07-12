import { body } from "express-validator";
import validate from "../middlewares/validate.js";
import {GENDER} from "../constants/enum.js";

export const registerUserValidator = [
  body("firstName")
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),

  body("lastName")
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),

  body("email")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ max: 128 })
    .withMessage("Password cannot exceed 128 characters")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
    ),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit Indian phone number"),

  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Please enter a valid date")
    .toDate(),

  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .isIn(Object.values(GENDER))
    .withMessage("Invalid gender"),

  body("bio")
    .isString()
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  validate,
];

export const loginUserValidator = [
  body("email")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),

  validate,
];
