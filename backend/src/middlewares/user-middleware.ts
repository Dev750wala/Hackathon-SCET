import { Request, Response, NextFunction } from "express";
import USER from "../models/user-model";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import jwt, { Jwt, Secret } from "jsonwebtoken"
import { SignupDetails, TokenUser, IUser } from "../interfaces/user-interfaces";


/**
 * Extending the express Request object with the IUser interface. 
 * I'm not sure, but I think here admin will also be seen as a user, because the schema of the both is same, so no need to worrym.
 * 
 * TODO just add the middleware in app.ts then the express request is modified with extended user.
 *  TWO CASES:
 *      1) if declared globally, then no need to specify the interface in route controllers. they are extended by default
 *      
 *      2) if declared individually, then we have to extend it by the new interface name. 
 *          ex. req: ModifiedReqest
 */
// declare global {
//     namespace Express {
//         interface Request {
//             user?: IUser | null;
//         }
//     }
// }


/**
 * middleware function for putting on the protected routes, those are only surfed by the logged in users.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export async function onlyLoggedInUsers(req: Request, res: Response, next: NextFunction) {
    const cookie = req.cookies?.jwt_token;

    if (!cookie) {
        /*
            if no cookie found named "jwt_token", redirect user to login page
        */
        return res.status(302).json({ message: "No cookie found" });
    }
    let userFromToken: TokenUser;

    try {
        const decodedToken: string | jwt.JwtPayload = jwt.verify(cookie, process.env.JWT_STRING as Secret );

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
        const user = await USER.findOne({ email: userFromToken.email });
        if (!user) {
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


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns If user is found then request is extended with the user object else req.user will be null
 */
// export async function checkUser(req: Request, res: Response, next: NextFunction) {
    
//     const cookie = req.cookies?.jwt_token;
//     await connectToDB();
    
//     if (!cookie) {
//         req.user = null;
//     } else {
//         try {
//             const userFromToken: string | jwt.JwtPayload = jwt.verify(cookie, process.env.JWT_STRING as Secret);
            
//             if (typeof userFromToken === 'object') {
//                 // ERROR might to be occur.
//                 const user = await USER.findOne({ email: userFromToken.email });
//                 if (user) {
//                     req.user = user;
//                 } else {
//                     req.user = null;
//                 }
//             } else {
//                 req.user = null;
//             }
//         } catch (error) {
//             disConnectfromDB();
//             console.error("Error connecting to DB", error);
//             return res.status(500).json({ message: "Internal server error" });
//         } finally {
//             disConnectfromDB();
//         }
//     }
//     next();
// }

export async function onlyVerifiedEmails(req: Request, res: Response, next: NextFunction) {
    const cookie: string = req.cookies?.jwt_token;

    const decodedToken: string | jwt.JwtPayload = jwt.verify(cookie, process.env.JWT_STRING as Secret);
    const userFromToken: TokenUser = decodedToken as TokenUser;

    if (userFromToken.verified === false) {
        return res.status(403).json({ message: "Email not verified" });
    }
    next();
}

export async function checkFieldsEmptyOrNot(req: Request, res: Response, next: NextFunction) {
    const body: SignupDetails = req.body;

    let emptyFields: string[] = [];

    // These two are not compulsory to insert in the form..
    const optionalFields: (keyof SignupDetails)[] = ['portfolio', 'socialLinks'];

    for (const key in body) {
        if (!optionalFields.includes(key as keyof SignupDetails)) {
            if (body[key as keyof SignupDetails] === "" || body[key as keyof SignupDetails] === undefined || body[key as keyof SignupDetails] === null) {
                emptyFields.push(key);
            }
        }
    }
    if (emptyFields.length > 0) {
        return res.status(400).json({ emptyFields: emptyFields });
    }
    next();
}