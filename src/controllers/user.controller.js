import userService from "../services/user.service.js";

class UserController {
  async register(req, res) {
    const user = await userService.register(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }

  async login(req, res) {
    const result = await userService.login(req.body);

    return res.status(200).json({
      success: true,
      messaged: "Login successfull",
      data: result,
    });
  }
}

export default new UserController();
