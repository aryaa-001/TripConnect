import cron from "node-cron";
import tripLifecycleService from "../services/trip-lifecycle.service.js";

cron.schedule("0 * * * *", async () => {
  console.log("Running trip lifecycle job...");

  try {
    const result = await tripLifecycleService.updateTripLifeCycle();
    console.log("Trip lifecycle completed: ", result);
  } catch (error) {
    console.log("Trip lifecycle failed", error);
  }
});
