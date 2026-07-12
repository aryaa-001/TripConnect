import { where } from "sequelize";
import { User } from "../models/index.js";

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id){
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({
      where: { email },
    });
  }

  async findByPhoneNumber(phoneNumber) {
    return await User.findOne({
      where: { phoneNumber },
    });
  }
}

export default new UserRepository();
