import AppError from "../../errors/AppError.js";

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError("Login required", 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError(
          "You are not authorized to perform this action",
          403,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorize;
