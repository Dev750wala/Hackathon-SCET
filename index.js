const express = require("express");
const keys = require("./secrets/key");
const userRoute = require("./routes/user");

const app = express();

app.use("/user", userRoute);

app.listen(keys.PORT, () => console.log(`Visit: http://localhost:${keys.PORT}`));