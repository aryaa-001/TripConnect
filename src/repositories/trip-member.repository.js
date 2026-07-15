import { TripMember } from "../models/index.js";
import { TRIP_MEMBER_STATUS } from "../constants/enum.js";

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
      where: { tripId, status: TRIP_MEMBER_STATUS.ACTIVE },
      attributes: ["tripRole", "status", "createdAt"],
      include: {
        association: "user",
        attributes: ["id", "firstName", "lastName", "profileImageUrl", "bio"],
        order: [["createdAt", "ASC"]],
      },
    });
  }

  async findByIdAndTrip(tripId, memberId) {
    return await TripMember.findOne({
      where: { id: memberId, tripId },
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
