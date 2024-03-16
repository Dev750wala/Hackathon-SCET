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

    if(token) {
        jwt.verify(token, keys.tokenSecretKey, async (error, decodedToken) => {
            if(error) {
                req.user = null;
            } else {
                const user = await USER.findById(decodedToken.id);
                req.user = user;
                
            }
        });
    } else {
        req.user = null;
    }
    next();
}

module.exports = {
    requireAuth,
    checkUser
}