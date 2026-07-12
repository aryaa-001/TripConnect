import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";

class City extends Model {}

City.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "India",
    },
  },
  {
    sequelize,
    modelName: "City",
    tableName: "cities",
    timestamps: true,
  },
);

export default City;
