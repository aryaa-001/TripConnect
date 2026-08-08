import userService from "../services/user.service.js";
import successResponse from "../utils/response.js";

class UserController {
  async register(req, res) {
    const user = await userService.register(req.body);

    return successResponse(res, {
      status: 201,
      message: "User registered successfully",
      data: user,
    });
  }

  async login(req, res) {
    const result = await userService.login(req.body);

    return successResponse(res, {
      message: "Login successful",
      data: result,
    });
  }
}

export default new UserController();