import { param } from "express-validator";
import validate from "../../middlewares/validate.js";

export const globalUuidValidator = [
  param("id").isUUID().withMessage("Invalid uuid"),

  validate,
];
