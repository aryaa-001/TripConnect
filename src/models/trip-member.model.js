import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import { TRIP_MEMBER_ROLE, TRIP_MEMBER_STATUS } from "../constants/enum.js";

class TripMember extends Model {}

TripMember.init(
  {
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

    // Membership Information
    tripRole: {
      type: DataTypes.ENUM(...Object.values(TRIP_MEMBER_ROLE)),
      allowNull: false,
      defaultValue: TRIP_MEMBER_ROLE.MEMBER,
    },

    status: {
      type: DataTypes.ENUM(...Object.values(TRIP_MEMBER_STATUS)),
      allowNull: false,
      defaultValue: TRIP_MEMBER_STATUS.ACTIVE,
    },

    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "TripMember",
    tableName: "trip_members",
    timestamps: true,
  },
);

export default TripMember;
