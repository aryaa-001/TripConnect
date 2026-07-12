import joinRequestService from "../services/join-request.service.js";

class JoinRequestController {
  async create(req, res) {
    const { tripId } = req.params;
    const { message } = req.body;

    const joinRequest = await joinRequestService.requestToJoin(
      tripId,
      req.user.id,
      message,
    );

    return res.status(201).json({
      success: true,
      message: "Join requests submitted successully",
      data: joinRequest,
    });
  }
}

export default new JoinRequestController();
