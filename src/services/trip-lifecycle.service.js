import { REGISTRATION_STATUS, TRIP_STATUS } from "../constants/enum.js";
import tripRepository from "../repositories/trip.repository.js";

class TripLifecycleService {
  async updateTripLifeCycle() {
    const trips = await tripRepository.getAllForLifecycle();

    const today = new Date();
    let processedTrips = 0;
    let updatedTrips = 0;
    let skippedTrips = 0;

    for (const trip of trips) {
      if (trip.status === TRIP_STATUS.CANCELLED) {
        skippedTrips++;
        continue;
      }

      processedTrips++;

      let newStatus = trip.status;
      let newRegistrationStatus = trip.registrationStatus;

      const startDate = new Date(trip.startDate);
      const endDate = trip.endDate ? new Date(trip.endDate) : null;

      if (today < startDate) {
        newStatus = TRIP_STATUS.PLANNED;
      } else if (endDate && today > endDate) {
        newStatus = TRIP_STATUS.COMPLETED;
      } else {
        newStatus = TRIP_STATUS.ONGOING;
      }

      const activeMembersCount = trip.members.length;

      if (
        newStatus === TRIP_STATUS.ONGOING ||
        newStatus === TRIP_STATUS.COMPLETED
      ) {
        newRegistrationStatus = REGISTRATION_STATUS.CLOSED;
      } else if (activeMembersCount >= trip.maxMembers) {
        newRegistrationStatus = REGISTRATION_STATUS.CLOSED;
      } else {
        newRegistrationStatus = REGISTRATION_STATUS.OPEN;
      }

      if (
        newStatus !== trip.status ||
        newRegistrationStatus !== trip.registrationStatus
      ) {
        await tripRepository.updateLifecycle(trip.id, {
          status: newStatus,
          registrationStatus: newRegistrationStatus,
        });

        updatedTrips++;
      }
    }

    return {
      processedTrips,
      updatedTrips,
      skippedTrips,
    };
  }
}

export default new TripLifecycleService();
