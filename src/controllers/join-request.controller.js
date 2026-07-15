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

  async getPendingRequests(req, res) {
    const { tripId } = req.params;

    const requests = await joinRequestService.getPendingRequests(tripId);

    return res.status(200).json({
      success: true,
      data: requests,
    });
  }

  async approve(req, res) {
    const joinRequest = await joinRequestService.approve(
      req.joinRequest,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Join request approved successfully",
      data: joinRequest,
    });
  }

  async reject(req, res) {
    const { responseMessage } = req.body;

    const joinRequest = await joinRequestService.reject(
      req.joinRequest,
      req.user.id,
      responseMessage,
    );

    return res.status(200).json({
      success: true,
      message: "Join request rejected successfully",
      data: joinRequest,
    });
  }

  async cancel(req, res) {
    const joinRequestId = req.params;

    const joinRequest = await joinRequestService.cancel(
      joinRequestId,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      message: "Join request cancelled successfully",
      data: joinRequest,
    });
  }
}

export default new JoinRequestController();
