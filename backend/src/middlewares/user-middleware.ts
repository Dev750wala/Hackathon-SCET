import { Request, Response, NextFunction } from "express";
import USER from "../models/user-model";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import jwt, { Secret } from "jsonwebtoken"
import { SignupDetails, TokenUser, IUser } from "../interfaces/user-interfaces";




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
        return res.status(302).json({ message: "No cookie found, Authentication required" });
    }
    let userFromToken: TokenUser;

    try {
        const decodedToken: string | jwt.JwtPayload = jwt.verify(cookie, process.env.JWT_STRING as Secret);

        if (typeof decodedToken === 'object') {
            userFromToken = decodedToken as TokenUser;
        } else {
            // redirect to the login route
            return res.status(302).json({ message: "Error in verifying token" });
        }
    } catch (error) {
        console.error("Error verifying token", error);
        // redirect to the login route
        return res.status(302).json({ message: "Unauthorized access, first login" })
    }

    await connectToDB();

    try {
        const user = await USER.findOne({ email: userFromToken.email });
        if (!user) {
            // disConnectfromDB();
            // redirect user back to the login page.
            return res.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        console.error("Error connecting to DB", error);
        // disConnectfromDB();
        // Render the page where it tells that please try again later.
        return res.status(500).json({ message: "Internal server error" });
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
export async function checkUser(req: Request, res: Response, next: NextFunction) {
    
    // await connectToDB();

    const cookie = req.cookies?.jwt_token;
    if (!cookie) {
            req.user = null;
    } else {
            try {
            const userFromToken: string | jwt.JwtPayload = jwt.verify(cookie, process.env.JWT_STRING as Secret);

            if (typeof userFromToken === 'object') {
                // ERROR might occur.
                const user = await USER.findOne({ email: userFromToken.email });
                console.log("User found:", user);
                
                if (user) {
                        req.user = user;
                } else {
                    req.user = null;
                }
            } else {
                req.user = null;
            }
        } catch (error) {
            console.error("User is null checkUser()");
            req.user = null;
        }
    }
    return next();
}

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
    console.log("Body:", typeof body);
    
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


/**
 * Middleware function to check if a user is already logged in.
 * If a user is already logged in (i.e., a JWT token is present in the request cookies),
 * this function will return a 403 status code with a message indicating that the user is already logged in.
 * If no JWT token is found in the request cookies, the function will call the next middleware function.
*
* @param {Request} req - Express request object containing the request cookies.
* @param {Response} res - Express response object to send a response back to the client.
* @param {NextFunction} next - Express next middleware function to be called if the user is not already logged in.
* @returns {void}
*/
export function checkIfUserAlreadyLoggedinOrNot(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.jwt_token;
    console.log("Hello World 1");
    
    if (!token) {
        console.log("No token found");
        return next();
    }
    
    try {
        const userFromToken: jwt.JwtPayload | string = jwt.verify(token, process.env.JWT_STRING as Secret);
        
        console.log("Token verified:", userFromToken);

        if (typeof userFromToken === 'object') {
            console.log("User is already logged in");
            return res.status(403).json({ message: "User already logged in" });
        }

        console.log("Token is not an object");
        return next();
    } catch (error) {
        console.log("Token verification failed", error);
        res.cookie("jwt_token", "", {
            path: "/",
            maxAge: 1,
        });
        return next();
    }
}


/**
 * Extending the express Request object with the IUser interface. 
 * I'm not sure, but I think here admin will also be seen as a user, because the schema of the both is same, so no need to worrym.
 * 
 *  TODO just add the middleware in app.ts then the express request is modified with extended user.
 *  TWO CASES:
 *      1) if declared globally, then no need to specify the interface in route controllers. they are extended by default
 *      
 *      2) if declared individually, then we have to extend it by the new interface name. 
 *          ex. req: ModifiedReqest
 */
declare global {
    namespace Express {
        interface Request {
            user?: IUser | null;
        }
    }
}