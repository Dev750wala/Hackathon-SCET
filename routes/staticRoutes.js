// 1.> GET /                => render home page
// 2.> GET /user/login      => login page render
// 3.> GET /user/signup     => signup page render

const express = require("express");
const router = express.Router();
const { checkUser } = require("../middlewares/user")

router
    .get("/", checkUser, (req, res) => {
        // console.log(`route/staticRoute: ${req.user}`)
        res.render("home", {
            title: "Home",
            user: req.user
        });
    })

    .get("/user/login", (req, res) => {
        res.render("login");
    })

    .get("/user/signup", (req, res) => {
        res.render("signup");
    })

module.exports = router;