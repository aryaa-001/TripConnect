import { TripMember } from "../models/index.js";
import { TRIP_MEMBER_STATUS } from "../constants/enum.js";
import { USER_PUBLIC_ATTRIBUTES } from "../constants/model-attributes.js";

class TripMemberRepository {
  async create(memberData, options = {}) {
    return await TripMember.create(memberData, options);
  }

  async findActiveMember(tripId, userId) {
    return await TripMember.findOne({
      where: {
        tripId,
        userId,
        status: TRIP_MEMBER_STATUS.ACTIVE,
      },
    });
  }

  async findActiveMembersByTrip(tripId) {
    return await TripMember.findAll({
      where: {
        tripId,
        status: TRIP_MEMBER_STATUS.ACTIVE,
      },

      attributes: ["tripRole", "status", "joinedAt"],

      include: [
        {
          association: "user",
          attributes: USER_PUBLIC_ATTRIBUTES,
        },
      ],

      order: [["createdAt", "ASC"]],
    });
  }

  async findByIdAndTrip(tripId, tripMemberId) {
    return await TripMember.findOne({
      where: { id: tripMemberId, tripId },
    });
  }

  async findDetailsById(id) {
    return await TripMember.findByPk(id, {
      attributes: ["tripRole", "status", "joinedAt"],

      include: [
        {
          association: "user",
          attributes: USER_PUBLIC_ATTRIBUTES,
        },
      ],
    });
  }

  async countActiveMembers(tripId) {
    return await TripMember.count({
      where: {
        tripId,
        status: TRIP_MEMBER_STATUS.ACTIVE,
      },
    });
  }

  async update(tripMember, options = {}) {
    return await tripMember.save(options);
  }
}

export default new TripMemberRepository();
