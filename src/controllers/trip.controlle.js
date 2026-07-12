import tripService from "../services/trip.service.js";

class TripController {
  async create(req, res) {
    const trip = await tripService.create(req.body, req.user.id);

    return res.status(201).json({
      success: true,
      message: "A new trip has been created",
      data: trip,
    });
  }
}

export default new TripController;