import { Router } from "express";

import healthRoutes from "./health.route.js";
import cityRoutes from "./city.routes.js";
import authRoutes from "./auth.routes.js";
import testRoutes from "./test.routes.js";
import tripRoutes from "./trip.routes.js";
import tripMemberRoutes from "./trip-members.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/cities", cityRoutes);
router.use("/auth", authRoutes);
router.use("/test", testRoutes);
router.use("/trip", tripRoutes);

router.use(tripMemberRoutes);

export default router;