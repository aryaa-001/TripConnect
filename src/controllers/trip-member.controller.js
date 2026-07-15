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
    const { tripId, memberId } = req.params;

    const removedMember = await tripMemberService.removeMember(
      tripId,
      memberId,
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
}

export default new TripMemberController();
