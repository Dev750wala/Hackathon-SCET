import { Request, Response, NextFunction } from "express";
import USER from "../models/user_model";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import jwt from "jsonwebtoken"
import { TokenUser } from "../controllers/user-controllers";

/**
 * middleware function for putting on the protected routes, those are only surfed by the logged in users.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export async function onlyLoggedInUsers(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies?.jwt_token;

    if ( !cookie ) {
        /*
            if no cookie found named "jwt_token", redirect user to login page
        */
        return res.status(302).json({ message: "No cookie found" });
    }
    let userFromToken: TokenUser;

    try {
        const decodedToken: string | jwt.JwtPayload = jwt.verify(cookie, process.env.JWT_STRING);

        if (typeof decodedToken === 'object') {
            userFromToken = decodedToken as TokenUser;
        } else {
            // redirect to the login route
            return res.status(302).json({ message: "Error in verifying token" });
        }
    } catch (error) {
        console.error("Error verifying token", error);
        // redirect to the login route
        return res.status(401).json({ message: "Unauthorized access, invalid token" })
    }

    await connectToDB();

    try {
        const user = await USER.findById(userFromToken._id);
        if(!user) {
            disConnectfromDB();
            // redirect user back to the login page.
            return res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        console.error("Error connecting to DB", error);
        disConnectfromDB();
        // Render the page where it tells that please try again later.
        return res.status(500).json({ message: "Internal server error" });
    } finally {
        disConnectfromDB();
    }

    next();
}

export async function checkUser(req: Request, res: Response, next: NextFunction) {
    await connectToDB();

    const cookie = req.cookies?.jwt_token;
    try {
        const userFromToken: string | jwt.JwtPayload = jwt.verify(cookie, process.env.JWT_STRING);

        if (typeof userFromToken === 'object') {
            const user = await USER.findById(userFromToken._id);
            if(user) {
                req.user = user;
                next();
            } else {
                req.user = undefined;
            }
        } else {
            req.user = undefined;
        }

    } catch (error) {
        disConnectfromDB();
        console.error("Error connecting to DB", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function onlyVerifiedEmails(req: Request, res: Response, next: NextFunction) {
    const cookie: string = req.cookies?.jwt_token;

    const decodedToken: string | jwt.JwtPayload = jwt.verify(cookie, process.env.JWT_STRING);
    const userFromToken: TokenUser = decodedToken as TokenUser;;

    if ( userFromToken.verified === false ) {
        return res.status(403).json({ message: "Email not verified" });
    }
    next();
}