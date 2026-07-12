import AppError from "../errors/AppError.js";
import userRepository from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../security/password.js";
import { generateToken } from "../security/jwt.js";
import { USER_ROLE } from "../constants/enum.js";

class UserService {
  async register(data) {
    //Existing email and phone number check
    const existingEmail = await userRepository.findByEmail(data.email);

    if (existingEmail) {
      throw new AppError("Email already registered", 409);
    }

    const existingPhoneNumber = await userRepository.findByPhoneNumber(
      data.phoneNumber,
    );

    if (existingPhoneNumber) {
      throw new AppError("Phone number already registered", 409);
    }

    //DOB check (should be greater than 18yrs)
    const today = new Date();
    const birthDate = new Date(data.dateOfBirth);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      throw new AppError("User must be at least 18 years old", 400);
    }

    const hashedPassword = await hashPassword(data.password);
    const userData = {
      ...data,
      role: USER_ROLE.USER,
      password: hashedPassword,
    };

    const user = await userRepository.create(userData);
    return user.toSafeObject();
  }

  async login(data) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new AppError("Your account has been suspended", 403);
    }

    const isPasswordCorrect = await comparePassword(
      data.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new AppError("Invlaid email or password");
    }

    const accessToken = generateToken({ userId: user.id });
    return {
      accessToken,
      user: user.toSafeObject(),
    };
  }
}

export default new UserService();
