const mongoose = require("mongoose");
const USER = require("../models/user-model")
const jwt = require("jsonwebtoken");
const keys = require("../secrets/key");
const validator = require("validator");

const maxAge = 3 * 24 * 60 * 60;

function createToken(id) {
    return jwt.sign({ id }, keys.tokenSecretKey.key, {
        expiresIn: maxAge
    });
}

function handleErrors(err) {
    // console.log(err);
    let errors = { email: '', username: '', password: '' };

    if (err.message === 'User not found') {
        errors.email = 'Incorrect Username';
        return errors;
    }

    if (err.message === 'Incorrect password') {
        errors.password = 'Please enter the correct password';
        return errors;
    }
  
    if (err.code === 11000) {
        errors.email = 'The email/id is already registered';
        return errors;
    }
  
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
  
    return errors;
}

async function handleUserSignup (req, res) {
    const body = req.body;

    try {
        const newUser = await USER.create({
            enrollmentNumber: body.enrollmentNumber,
            username: body.username,
            email: body.email,
            password: body.password,
            biography: body.biography,
            fullName: body.fullName,
            contact_no: body.contact_no,
            skills: body.skills,
            portfolio: body.portfolio,
            socialLinks: {
                linkedin: body.linkedin,
                github: body.github,
            }
        });
        const token = createToken(newUser._id);

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge*1000,  // 3 days
        })
        res.status(201).json({ user: newUser });

    } catch (error) {
        const err = handleErrors(error);
        return res.json({ error: err });
    }
}

async function handleUserLogin (req, res) {
    const { usernameOrEmail, password } = req.body;
    var input = "";
    validator.isEmail(usernameOrEmail) ? input="email" : input="password";
    
    try {
        const user = await USER.login(input, usernameOrEmail, password);
        const token = createToken(user._id);

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge*1000,  // 3 days
        });
        res.status(200).json({ user: user._id });

    } catch (error) {
        const err = handleErrors(error);
        return res.json({ error: err });
    }
}

async function handleUserProfile (req, res) {
    res.send("You are at profile page");
}

async function handleUserLogout (req, res) {
    console.log("logging out");
    res.cookie("jwt", "", {
        maxAge: 1,
    });
    res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin,
    handleUserProfile,
    handleUserLogout,
}