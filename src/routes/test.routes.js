import { Router } from "express";
import authenticate from "../middlewares/authenticate.middleware.js";
import authorize from "../middlewares/authorization/platform-authorize.middleware.js";
import { USER_ROLE } from "../constants/enum.js";

const router = Router();

router.get("/me", authenticate, (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
});

router.get(
  "/admin-test",
  authenticate,
  authorize(USER_ROLE.ADMIN),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Welcome Admin",
    });
  },
);

export default router;
