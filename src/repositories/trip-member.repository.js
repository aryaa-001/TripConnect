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

  async countActiveMembers(tripId) {
    return await TripMember.count({
      where: {
        tripId,
        status: TRIP_MEMBER_STATUS.ACTIVE,
      },
    });
  }
}

export default new TripMemberRepository();
