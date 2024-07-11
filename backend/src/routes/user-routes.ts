// 1.> POST /user/signup
// 2.> POST /user/login
// 3.> GET /user/:username
// 4.> GET /user/logout

import express from 'express';
import { handleUserLogin, handleUserLogout, handleUserProfile, handleUserSignup, handleVerifyUserEmail } from '../controllers/user-controllers';
import { onlyLoggedInUsers, checkUser, checkFieldsEmptyOrNot } from '../middlewares/middleware';

const userRoute: express.Router = express.Router();

userRoute
    .post("/signup", checkFieldsEmptyOrNot, handleUserSignup)

    .post("/login", handleUserLogin)

    .get("/logout", handleUserLogout)

    // to see the other users' as well as their self profile
    .get("/:username", handleUserProfile)

    .get("/verify-email/:verificationId", handleVerifyUserEmail)

export default userRoute;
