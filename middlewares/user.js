const USER = require("../models/user-model");
const jwt = require("jsonwebtoken");
const keys = require("../secrets/key");

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, keys.tokenSecretKey, (error, decodedToken) => {
            error ? res.redirect("user/login") : next();
        })
    } else {
        res.redirect("user/login");
    }
}

const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    // console.log(req.cookies);
    if(token) {
        jwt.verify(token, keys.tokenSecretKey.key, async (error, decodedToken) => {
            if(error) {
                req.user = null;
            } else {
                try {
                    const user = await USER.findById(decodedToken.id);
                    req.user = user;
                    // console.log(`/middleware/checkuser ${req.user}`);
                    next(); 
                } catch (err) {
                    req.user = null;
                    next();
                }
            }
        });
    } else {
        req.user = null;
        next();
    }
}

const requireRoleForCreatingHackathon = (req, res, next) => {
    const role = req.user.role;

    if(role === "student") {
        return res.status(401).json({
            message: "You are not authorized to create a hackathon"
        });
    }
    next();
}

module.exports = {
    requireAuth,
    checkUser,
    requireRoleForCreatingHackathon
}