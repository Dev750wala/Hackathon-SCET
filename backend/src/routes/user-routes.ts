// 1.> POST /user/signup
// 2.> POST /user/login
// 3.> GET /user/:username
// 4.> GET /user/logout

import express from 'express';
import { handleUserLogin, handleUserLogout, handleUserProfile, handleUserSignup, handleVerifyUserEmail, handleParticipateInProject, verifyUserFromToken, handleShowProjectDetails } from '../controllers/user-controllers';
import { onlyLoggedInUsers, checkIfUserAlreadyLoggedinOrNot, checkFieldsEmptyOrNot } from '../middlewares/user-middleware';

const userRoute: express.Router = express.Router();

userRoute
    .post("/signup", checkIfUserAlreadyLoggedinOrNot, checkFieldsEmptyOrNot, handleUserSignup)

    .post("/login", checkIfUserAlreadyLoggedinOrNot, handleUserLogin)

    .post("/logout", handleUserLogout)

    .get("/:username", handleUserProfile)

    .get("/verifyEmail/:username/:verificationCode", handleVerifyUserEmail)

    .get("/projects/:projectId", handleShowProjectDetails)

    .post("/participate/:username/:projectId", onlyLoggedInUsers, handleParticipateInProject)

    .get("/api/auth/verify", verifyUserFromToken)

export default userRoute;
