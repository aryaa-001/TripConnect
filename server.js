import env from "./src/config/env.js";
import app from "./src/app.js";
import sequelize from "./src/config/db.js";
import "./src/models/index.js";

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({
        alter: true
    });
    console.log("✅ Database connected sucessfully.");
    console.log("✅ Database syncronized.");

    app.listen(env.port, () => {
      console.log("🚀 Server started listening on port", env.port);
    });
  } catch (error) {
    console.log("Database connection failed ⛓️‍💥");
    console.log(error.message);

    process.exit(1);
  }
};

startServer();
