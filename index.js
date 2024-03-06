const express = require("express");

const keys = require("./secrets/key");

const userRoute = require("./routes/user");
const hackathonRoute = require("./routes/hackathon");
const staticRoute = require("./routes/staticRoutes");

const app = express();

app.set("view engine", "ejs");

// All the routes to handle the req.
app.use("/", staticRoute);
app.use("/user", userRoute);
app.use("/hackathon", hackathonRoute);


app.listen(keys.PORT, () => console.log(`Visit: http://localhost:${keys.PORT}`));