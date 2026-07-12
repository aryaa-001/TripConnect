import AppError from "../errors/AppError.js";
import { verifyToken } from "../security/jwt.js";
import userRepository from "../repositories/user.repository.js";

const authenicate = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new AppError("authorization required", 401);
    }
    if (!authorizationHeader.startsWith("Bearer ")) {
      throw new AppError("Invalid authorizaton header", 401);
    }
    const token = authorizationHeader.split(" ")[1];

    const payload = verifyToken(token);

    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new AppError("Invalid authentication token", 401);
    }

    if (!user.isActive) {
      throw new AppError("Your account has been suspended", 403);
    }
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenicate;
