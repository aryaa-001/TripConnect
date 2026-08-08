import { JoinRequest } from "../models/index.js";
import { REQUEST_STATUS } from "../constants/enum.js";
import { USER_PUBLIC_ATTRIBUTES } from "../constants/model-attributes.js";

class JoinRequestRepository {
  async create(requestData) {
    return await JoinRequest.create(requestData);
  }

  async findById(id) {
    return await JoinRequest.findByPk(id);
  }

  async findDetailsById(id) {
    return await JoinRequest.findByPk(id, {
      attributes: {
        exclude: ["userId", "reviewedBy"],
      },

      include: [
        {
          association: "requester",
          attributes: USER_PUBLIC_ATTRIBUTES,
        },
      ],
    });
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
          attributes: USER_PUBLIC_ATTRIBUTES,
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
