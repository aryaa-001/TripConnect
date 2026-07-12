import { body } from "express-validator";
import validate from "../middlewares/validate.js";

export const creatCityValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("City name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be atleast 2 characters"),

  body("state").trim().notEmpty().withMessage("State is required"),

  body("country").optional().trim(),

  validate,
];
