import tripMemberService from "../services/trip-members.service.js";

class TripMemberController {
  async getMembers(req, res) {
    const { id } = req.params;
    const members = await tripMemberService.getMembers(id);

    return res.status(200).json({
      success: true,
      data: members,
    });
  }

  async removeMember(req, res) {
    const { tripId, tripMemberId } = req.params;

    const removedMember = await tripMemberService.removeMember(
      tripId,
      tripMemberId,
      req.tripMember,
    );

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      data: removedMember,
    });
  }

  async leaveTrip(req, res) {
    const leftMember = await tripMemberService.leaveTrip(req.tripMember);

    return res.status(200).json({
      success: true,
      message: "You have left the trip successfully",
      data: leftMember,
    });
  }

  async promoteMember(req, res) {
    const { tripId, tripMemberId } = req.params;

    const moderator = await tripMemberService.promoteMember(
      tripId,
      tripMemberId,
    );

    return res.status(200).json({
      success: true,
      message: "Member has been promoted to moderator successfully",
      data: moderator,
    });
  }

  async demoteMember(req, res) {
    const { tripId, tripMemberId } = req.params;

    const member = await tripMemberService.demoteMember(tripId, tripMemberId);

    res.status(200).json({
      success: true,
      message: "Moderator has been demoted to member successfully",
      data: member,
    });
  }
}

export default new TripMemberController();
