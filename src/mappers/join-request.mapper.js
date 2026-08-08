import { toUserProfileResponse } from "./user.mapper.js";

const toJoinRequestResponse = (joinRequest) => {
  return {
    id: joinRequest.id,
    status: joinRequest.status,
    message: joinRequest.message,
    responseMessage: joinRequest.responseMessage,
    requestedAt: joinRequest.createdAt,
    reviewedAt: joinRequest.reviewedAt,

    requester: joinRequest.requester
      ? toUserProfileResponse(joinRequest.requester)
      : undefined,
  };
};

export { toJoinRequestResponse };
