import { JoinRequest } from "../models/index.js";
import { REQUEST_STATUS } from "../constants/enum.js";

class JoinRequestRepository {
  async create(requestData) {
    return await JoinRequest.create(requestData);
  }

  async findById(id) {
    return await JoinRequest.findByPk(id);
  }

  async findPendingRequest(tripId, userId) {
    return await JoinRequest.findOne({
      where: {
        tripId,
        userId,
        status: REQUEST_STATUS.PENDING,
      },
    });
  }

  async findPendingRequestByTrip(tripId) {
    return await JoinRequest.findOne({
      where: {
        tripId,
        status: REQUEST_STATUS.PENDING,
      },
    });
  }

  async update(joinRequest) {
    return await joinRequest.save();
  }
}

export default new JoinRequestRepository();
