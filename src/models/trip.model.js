import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js";
import {
  TRIP_STATUS,
  TRIP_VISIBILITY,
  REGISTRATION_STATUS,
} from "../constants/enum.js";


class Trip extends Model {}

Trip.init(
  {
    // Basic information
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    registrationDeadline: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    meetingPoint: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    maxMembers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Trip status info
    status: {
      type: DataTypes.ENUM(...Object.values(TRIP_STATUS)), // planned, completed.. etc
      allowNull: false,
      defaultValue: TRIP_STATUS.PLANNED,
    },
    visibility: {
      type: DataTypes.ENUM(...Object.values(TRIP_VISIBILITY)), // public or private
      allowNull: false,
      defaultValue: TRIP_VISIBILITY.PUBLIC,
    },
    registrationStatus: {
      type: DataTypes.ENUM(...Object.values(REGISTRATION_STATUS)), // can people still join the trip?
      allowNull: false,
      defaultValue: REGISTRATION_STATUS.OPEN,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    departureCityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "cities",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Trip",
    tableName: "trips",
    timestamps: true,
  },
);

export default Trip;
