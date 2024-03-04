// 1.> /user/signup
// 2.> /user/login
// 3.> /user/profile
// 4.> /user/logout
const express = require("express");
const router = express.Router();
const { handleUserSignup, handleUserLogin, handleUserProfile, handleUserLogout } = require("../controllers/user");

router
    .get("/signup", handleUserSignup)
    .get("/login", handleUserLogin)
    .get("/profile", handleUserProfile)
    .get("/logout", handleUserLogout);

module.exports = router;