const toUserAccountResponse = (user) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    dateOfBirth: user.dateOfBirth,
    gender: user.gender,
    bio: user.bio,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    isPhoneVerified: user.isPhoneVerified,
  };
};

const toUserProfileResponse = (user) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    profileImageUrl: user.profileImageUrl,
  };
};

export { toUserAccountResponse, toUserProfileResponse };
