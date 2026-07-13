import { Router } from "express";
import cityController from "../controllers/city.controller.js";
import { creatCityValidator } from "../validators/city.validator.js";

import authenicate from "../middlewares/authenticate.middleware.js";
import platformAuthorize from "../middlewares/authorization/platform-authorize.middleware.js";
import { USER_ROLE } from "../constants/enum.js";

const router = Router();

router.post(
  "/",
  authenicate,
  platformAuthorize(USER_ROLE.ADMIN),
  creatCityValidator,
  cityController.create,
);

router.get(
  "/",
  authenicate,
  platformAuthorize(USER_ROLE.ADMIN),
  cityController.getALl,
);

export default router;
