import env from "./src/config/env.js";
import app from "./src/app.js";

app.listen(env.port, ()=>{
    console.log("Server started listening on port", env.port)
});