// 1.> POST /user/signup
// 2.> POST /user/login
// 3.> GET /user/:username
// 4.> GET /user/logout

import express from 'express';
import { handleUserLogin, handleUserLogout, handleUserProfile, handleUserSignup, handleVerifyUserEmail } from '../controllers/user-controllers';
import { onlyLoggedInUsers, checkIfUserAlreadyLoggedinOrNot, checkFieldsEmptyOrNot } from '../middlewares/user-middleware';

const userRoute: express.Router = express.Router();

userRoute
    .post("/signup", checkIfUserAlreadyLoggedinOrNot, checkFieldsEmptyOrNot, handleUserSignup)

    .post("/login", checkIfUserAlreadyLoggedinOrNot, handleUserLogin)

    .post("/logout", handleUserLogout)

    // to see the other users' as well as their self profile
    .get("/:username", handleUserProfile)

    .get("/verifyEmail/:username/:verificationCode", handleVerifyUserEmail)

export default userRoute;
