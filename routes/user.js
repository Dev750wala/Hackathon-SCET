// 1.> POST /user/signup
// 2.> POST /user/login
// 3.> GET /user/:username
// 4.> GET /user/logout

const express = require("express");
const router = express.Router();
const { handleUserSignup, handleUserLogin, handleUserProfile, handleUserLogout } = require("../controllers/user");

router
    .post("/signup", handleUserSignup)
    
    .post("/login", handleUserLogin)

    .get("/logout", handleUserLogout)
    
    .get("/:username", handleUserProfile);

module.exports = router;