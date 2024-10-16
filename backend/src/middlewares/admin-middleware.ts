import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { AdminPayload, AdminSignupDetails } from "../interfaces/admin-interfaces";
import { ProjectCreationDetails } from "../interfaces/project-interfaces";

/**
 * 
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function to move the request further
 * @param return Codes: { 
 *                  401: "Admin cookie not found", 
 *                  403: "Not a admin", 
 *                  500: "Internal server error" 
 *                  }
 */
export async function adminAuth(req: Request, res: Response, next: NextFunction) {
    /*
        Add admin authentication logic here
        If admin is authenticated, call next()
        If admin is not authenticated, return an error response
    */

    const adminCookie = req.cookies?.admin;

    if (!adminCookie) return res.status(401).json({ message: "You're prohibited!" });

    try {
        const decoded = jwt.verify(adminCookie, process.env.JWT_STRING as Secret) as AdminPayload;

        /* 
            Check if the admin is authenticated by verifying the token.
            If the admin is authenticated, set req.admin to the decoded admin data.
            If the admin is not authenticated, return an error response.

            if isAdmin === true then next() else return forbidden gateway response.
        */

        if (decoded.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden' });
        }
    } catch (error: unknown) {
        console.log(`Error in verifying the admin token: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    }
}


/**
 * 
 * @param req express request object
 * @param res express response object
 * @param next next function
 * @returns if any of the required field is empty in the signup form, it will return back, else call next function  
 */
export async function checkAdminSignupFieldsEmptyOrNot(req: Request, res: Response, next: NextFunction) {
    const body: Partial<AdminSignupDetails> = req.body;

    if (!body) {
        return res.status(400).json({ message: "Please insert the required fields" });
    }

    let emptyFields: string[] = [];

    // This field is not necessary to insert in the form..
    const optionalFields: (keyof AdminSignupDetails)[] = ['portfolio', 'socialLinks'];

    const requiredFields: (keyof AdminSignupDetails)[] = [
        'username',
        'email',
        'password',
        'fullName',
        'contact_no',
        'skills',
        'biography'
    ];

    for (const field of requiredFields) {
        if (body[field] === "" || body[field] === undefined || body[field] === null) {
            emptyFields.push(field);
        }
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ message: "Please fill in the required fields", emptyFields });
    }
    next();
}

/**
 * 
 * @param req express request object
 * @param res express response object
 * @param next next function
 * @returns if any of the required field is empty in the project creation form, it will return back, else call next function  
 */
export function checkProjectCreationFieldsEmptyOrNot(req: Request, res: Response, next: NextFunction) {
    const body: ProjectCreationDetails = req.body;

    let emptyFields: string[] = [];

    // This field is not necessary to insert in the form..
    const optionalFields: (keyof ProjectCreationDetails)[] = ['prizes', 'theme'];

    for (const key in body) {
        if (!optionalFields.includes(key as keyof ProjectCreationDetails)) {
            if (body[key as keyof ProjectCreationDetails] === "" || body[key as keyof ProjectCreationDetails] === undefined || body[key as keyof ProjectCreationDetails] === null) {
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
export function checkIfAdminAlreadyLoggedinOrNot(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.jwt_token;
    // console.log("Hello World 1");
    
    if (!token) {
        console.log("No token found");
        return next();
    }
    
    try {
        const userFromToken: jwt.JwtPayload | string = jwt.verify(token, process.env.JWT_STRING as Secret);
        
        console.log("Token verified:", userFromToken);

        if (typeof userFromToken === 'object') {
            console.log("User is already logged in");
            return res.status(302).json({ message: "Admin already logged in" });
        }

        console.log("Token is not an object");
        next();
    } catch (error) {
        console.log("Token verification failed", error);
        res.cookie("jwt_token", "", {
            path: "/",
            maxAge: 1,
        });
        return next();
    }
}