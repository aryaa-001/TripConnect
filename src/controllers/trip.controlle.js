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

  async getById(req, res) {
    const { id } = req.params;

    const trip = await tripService.getById(id);

    return res.status(200).json({
      success: true,
      data: trip,
    });
  }

  async getAllTrips(req, res) {
    const result = await tripService.getAllTrips(req.query);

    return res.status(200).json({
      success: true,
      data: result.trips,
      pagination: result.pagination,
    });
  }

  async update(req, res) {
    const { id } = req.params;
    console.log(id)
    const updatedTrip = await tripService.update(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Trip updated successfully",
      data: updatedTrip,
    });
  }
}

export default new TripController();
