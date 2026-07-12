import { Router } from "express";
import userController from "../controllers/user.controller.js";
import {
  registerUserValidator,
  loginUserValidator,
} from "../validators/user.validator.js";

import authenticate from "../middlewares/authenticate.middleware.js";

const router = Router();

router.post("/register", registerUserValidator, userController.register);
router.post("/login", loginUserValidator, userController.login);

export default router;
