const express = require("express");
const keys = require("./secrets/key");
const userRoute = require("./routes/user");
const hackathonRoute = require("./routes/hackathon");
const staticRoute = require("./routes/staticRoutes");
const { connectToDB } = require("./connection");
const { checkUser } = require("./middlewares/user");

const app = express();
connectToDB("mongodb://127.0.0.1:27017/hackathon-scet")
    .then(() => console.log("MongoDB connected!"))
    .catch((e) => console.log(`Unexpected error occurred: ${e}`));

app.use(express.json());
app.set("view engine", "ejs");
// app.use(express.urlencoded({ extended: false }));

// All the routes to handle the req.
app.use('*', checkUser);
app.use("/", staticRoute);
app.use("/user", userRoute);
app.use("/hackathon", hackathonRoute);
// app.use("/demo", (req, res) => {
//     console.log(req);
// })

app.listen(keys.port.PORT, () => console.log(`Visit: http://localhost:${keys.port.PORT}`));