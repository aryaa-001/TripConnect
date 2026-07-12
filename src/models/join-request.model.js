import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import { REQUEST_STATUS } from "../constants/enum.js";

class JoinRequest extends Model {}

JoinRequest.init(
  {
    // Primary Key
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // Relationships
    tripId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "trips",
        key: "id",
      },
    },

    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    // Request Details
    status: {
      type: DataTypes.ENUM(...Object.values(REQUEST_STATUS)),
      allowNull: false,
      defaultValue: REQUEST_STATUS.PENDING,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    responseMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Review Information
    reviewedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    reviewedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "JoinRequest",
    tableName: "join_requests",
    timestamps: true,
  },
);

export default JoinRequest;
