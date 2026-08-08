import joinRequestService from "../services/join-request.service.js";
import successResponse from "../utils/response.js";

class JoinRequestController {
  async create(req, res) {
    const tripId  = req.params.id;
    const { message } = req.body;

    const joinRequest = await joinRequestService.requestToJoin(
      tripId,
      req.user.id,
      message,
    );

    return successResponse(res, {
      status: 201,
      message: "Join request submitted successfully",
      data: joinRequest,
    });
  }

  async getPendingRequests(req, res) {
    const { tripId } = req.params;

    const requests = await joinRequestService.getPendingRequests(tripId);

    return successResponse(res, {
      message: "Pending join requests fetched successfully",
      data: requests,
    });
  }

  async approve(req, res) {
    const joinRequest = await joinRequestService.approve(
      req.joinRequest,
      req.user.id,
    );

    return successResponse(res, {
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

    return successResponse(res, {
      message: "Join request rejected successfully",
      data: joinRequest,
    });
  }

  async cancel(req, res) {
    const joinRequestId = req.params.id;

    const joinRequest = await joinRequestService.cancel(
      joinRequestId,
      req.user.id,
    );

    return successResponse(res, {
      message: "Join request cancelled successfully",
      data: joinRequest,
    });
  }
}

export default new JoinRequestController();