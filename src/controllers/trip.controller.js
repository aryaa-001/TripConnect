import tripService from "../services/trip.service.js";
import successResponse from "../utils/response.js";

class TripController {
  async create(req, res) {
    const trip = await tripService.create(req.body, req.user.id);

    return successResponse(res, {
      status: 201,
      message: "A new trip has been created",
      data: trip,
    });
  }

  async getDetailsById(req, res) {
    const { id } = req.params;

    const trip = await tripService.getDetailsById(id);

    return successResponse(res, {
      message: "Trip fetched successfully",
      data: trip,
    });
  }

  async getAllTrips(req, res) {
    const result = await tripService.getAllTrips(req.query);

    return successResponse(res, {
      message: "Trips fetched successfully",
      data: result.trips,
      meta: result.pagination,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const updatedTrip = await tripService.update(id, req.body);

    return successResponse(res, {
      message: "Trip updated successfully",
      data: updatedTrip,
    });
  }
}

export default new TripController();
