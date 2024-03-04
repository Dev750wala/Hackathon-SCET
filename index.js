const express = require("express");
const keys = require("./secrets/key");

const app = express();



app.listen(keys.PORT, () => console.log(`Visit: http://localhost:${keys.PORT}`))