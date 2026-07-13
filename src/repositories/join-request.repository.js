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

  async findPendingRequestsByTrip(tripId) {
    return await JoinRequest.findAll({
      where: {
        tripId,
        status: REQUEST_STATUS.PENDING,
      },

      attributes: {
        exclude: ["userId", "reviewedBy"],
      },

      include: [
        {
          association: "requester",
          attributes: ["id", "firstName", "lastName", "profileImageUrl", "bio"],
        },
      ],

      order: [["createdAt", "ASC"]],
    });
  }

  async update(joinRequest, options = {}) {
    return await joinRequest.save(options);
  }
}

export default new JoinRequestRepository();
