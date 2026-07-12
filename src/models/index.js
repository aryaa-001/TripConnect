import City from "./city.model.js";
import User from "./user.model.js";
import Trip from "./trip.model.js";
import TripMember from "./trip-member.model.js";
import JoinRequest from "./join-request.model.js";

// Trip-User relationship
Trip.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

User.hasMany(Trip, {
  foreignKey: "createdBy",
  as: "createdTrips",
});

// Trip-City relationship
Trip.belongsTo(City, {
  foreignKey: "departureCityId",
  as: "city",
});

City.hasMany(Trip, {
  foreignKey: "departureCityId",
  as: "trips",
});

// Trip_member - User relationship
TripMember.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

User.hasMany(TripMember, {
  foreignKey: "userId",
  as: "tripMemberships",
});

// Trip_member - Trip relationship
TripMember.belongsTo(Trip, {
  foreignKey: "tripId",
  as: "trip",
});

Trip.hasMany(TripMember, {
  foreignKey: "tripId",
  as: "members",
});

// Join Request -> Trip
JoinRequest.belongsTo(Trip, {
  foreignKey: "tripId",
  as: "trip",
});

Trip.hasMany(JoinRequest, {
  foreignKey: "tripId",
  as: "joinRequests",
});

// Join Request -> Requester
JoinRequest.belongsTo(User, {
  foreignKey: "userId",
  as: "requester",
});

User.hasMany(JoinRequest, {
  foreignKey: "userId",
  as: "joinRequests",
});

// Join Request -> Reviewer
JoinRequest.belongsTo(User, {
  foreignKey: "reviewedBy",
  as: "reviewer",
});

User.hasMany(JoinRequest, {
  foreignKey: "reviewedBy",
  as: "reviewedRequests",
});

export { City, User, Trip, TripMember, JoinRequest };
