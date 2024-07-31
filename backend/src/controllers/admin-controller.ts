import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken"
import USER from "../models/user-model";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import validator from "validator";
import bcrypt from "bcrypt"
import { nanoid } from "../utilities/nanoid";
import PROJECT from "../models/project-model";
// Admin interfaces
import { AdminTokenUser, AdminLoginRequestBody, AdminPayload, AdminUpdateProfileRequest } from "../interfaces/admin-interafaces";
import { ProjectCreationDetails, IProject } from "../interfaces/project-interfaces";
import { IUser, TokenUser } from "../interfaces/user-interfaces";
import { handleErrors } from "../utilities/handleErrors";

function signToken(user: AdminTokenUser) {
    const token = jwt.sign(user, process.env.JWT_STRING as string, {
        expiresIn: '1h',
    })

    return token;
}


/**
 * at the path: /admin
 * @param req 
 * @param res 
 * @returns Codes: { 
 *                  200: "Authentication successful" 
 *                  400: "password is required", 
 *                  401: "Invalid credentials", 
 *                 }
 */
export async function handleAdminAuth(req: Request, res: Response) {
    const { password } = req.body;
    // console.log("hello world1");
    // console.log(req);
    

    if (!password) return res.status(400).json({ message: "Password is required" });

    // console.log("hello world2");
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: "Invalid admin password" });

    const isAdmin: AdminPayload = {
        isAdmin: true,
    }

    const token = jwt.sign(
        isAdmin,
        process.env.JWT_STRING as string,
        { expiresIn: '1h' }
    );

    // admin_token
    res.cookie("admin", token, { httpOnly: true, maxAge: 1000*60*60 });
    return res.status(200).json({ message: "Authenticated successfully" });
}

/**
 * at the path /admin/signup
 * @param req 
 * @param res 
 * @returns Codes: { 
 *                  201: "created successfully"
 *                  400: "Invalid email" / duplicate fields found
 *                  400:  message: "Please insert the required fields"
 *                  401: "Admin cookie not found", 
 *                  403: "Not a admin", 
 *                  500: "Internal server error" 
 *                  }
 */
export async function handleAdminSignup(req: Request, res: Response) {
    await connectToDB();

    // console.log(req.body);
    

    const { username, email, password, fullName, contact_no, skills, biography, socialLinks } = req.body;

    if (!validator.matches(email, "scet.ac.in")) {
        return res.status(400).json({ invalidMail: "Please enter only SCET Email address" });
    }


    try {

        const userWithSameEmail = await USER.findOne({ email: email });
        const userWithSameUsername = await USER.findOne({ username: username });

        const duplication = {
            email: userWithSameEmail ? true : false,
            username: userWithSameUsername ? true : false,
        };

        if (Object.values(duplication).some(Boolean)) {
            return res.status(400).json({ duplication: duplication });
        }

        const verificationString = await bcrypt.hash(nanoid(40), 10);

        const newUser = await USER.create({
            username: username,
            email: email,
            password: password,
            biography: biography,
            fullName: fullName,
            contact_no: contact_no,
            role: "organizer",
            skills: skills,
            socialLinks: {
                linkedin: socialLinks?.linkedin,
                github: socialLinks?.github,
            },
            'verificationCode.code': verificationString,
            'verificationCode.createdAt': Date.now(),
            verified: true,
        });

        const tokenObject: AdminTokenUser = {
            name: newUser.fullName,
            role: newUser.role,
            username: newUser.username,
            email: newUser.email,
        }

        const token = signToken(tokenObject);
        return res.cookie("jwt_token", token).status(201).json({ user: newUser });

    } catch (error: unknown) {
        console.log(`Unexpected error occured during user signup: ${error}\n\n`);
        const err = handleErrors(error, "organizer");

        // console.log(`hello world   ${JSON.stringify(err)}\n\n`);
        
        if(err.general.includes("An internal server error occurred.") || err.general.includes("An unexpected error occurred.")) {
            return res.status(500).json({ serverError: err });
        
        } else {
            return res.status(400).json({ signupErrors: err });
        }

    } finally {
        disConnectfromDB();
    }
}



/**
 * Handles the admin login process.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 *
 * @returns {Promise<Response>} - Returns a Promise that resolves to an Express response object.
 * The response object will contain a status code of 200 if the login is successful,
 * and a JSON object containing the user's information. If the login fails,
 * the response object will contain a status code of 500 and an error message.
 */
export async function handleAdminLogin(req: Request, res: Response): Promise<Response> {
    const body: AdminLoginRequestBody = req.body;

    
    try {
        const user: IUser = await USER.adminLogin(body);

        const tokenObject: AdminTokenUser = {
            name: user.fullName,
            role: user.role,
            username: user.username,
            email: user.email,
        }
        const token = signToken(tokenObject);

        return res.cookie("jwt_token", token).status(200).json({ user: user });
        
    } catch (error) {
        console.log(`Unexpected error occured during user signup: ${error}`);
        const errors = handleErrors(error, "organizer");
        return res.status(500).json({ error: errors });
    }

}


/**
 * 
 * @param req
 * @param res 
 * @returns Codes: {
 *              200: "Logged out successfully"
 *          }
 */
export function handleAdminLogout(req: Request, res: Response) {
    res.clearCookie("jwt_token", { httpOnly: true, secure: true, sameSite: 'strict' });
    res.clearCookie("admin", { httpOnly: true, secure: true, sameSite: 'strict' })
    return res.status(200).json({ message: "Logged out successfully" });
}



/**
 * 
 * @param req 
 * @param res
 * @returns Codes : {
 *      201 - project created
 *      302 - jwt_token cookie not found/ cookie not verified
 *      400 - empty fields in the form / dateError("startDate > endDate"error)
 *      401 - prohibited / Unauthorized access, invalid token
 *      403 - forbidden
 *      404 - user not found
 *      500 - server error
 * } 
 */
export async function handleCreateProject(req: Request, res: Response) {
    const body: ProjectCreationDetails = req.body;

    await connectToDB();

    const cookie = req.cookies.jwt_token;

    const userFromToken = jwt.verify(cookie, process.env.JWT_STRING as Secret) as AdminTokenUser;
    
    if(!userFromToken) {
        return res.status(302).json({ error: "jwt_token cookie not found or cookie not verified" });
    }

    try {

        const projectCreator = await USER.findOne({ email: userFromToken.email });

        const id = nanoid(15);

        const startDate = new Date(body.start);
        const endDate = new Date(body.end);

        if (startDate.getTime() <= endDate.getTime()) {
            return res.status(400).json({ dateError: "Start date must be before end date" });
        }

        const newProject = await PROJECT.create({
            id: id,
            name: body.name,
            description: body.description,
            start: body.start,
            end: body.end,
            organizer: projectCreator?._id,
            maxParticipants: body.maxParticipants,
            judges: body.judges,
            prizes: body.prizes,
            rulesAndRegulations: body.rulesAndRegulations,
            theme: body.theme,
            techTags: body.techTags,
            status: Date.now() < startDate.getTime() ? 'planned' : 'ongoing',
        });

        return res.status(201).json({ message: "Project created!", project: newProject });


    } catch (error) {
        console.log(`Error creating project: ${error}`);
        return res.status(500).json({ error: "Internal server error" });
    } finally {
        disConnectfromDB();
    }
}

/**
 * 
 * @param req 
 * @param res 
 * @returns Codes: {
 *      401 - message: "You're prohibited!",
 *      403 - message: "Forbidden",
 *      500 - message: "Internal server error",
 *      302 - message: "No cookie found"
 *      302 - message: "Error in verifying token"
 *      401 - message: "Unauthorized access, invalid token"
 *      404 - message: "User not found"
 *      400 - emptyFields: emptyFields (string[])  ex. ["fullName", "username", "contact_no"]
 *      302 - message: "No cookie found"
 *      302 - message: "No cookie found"
 *      200 - updatedUser: updatedUser (IUser)
 * }
 */
export async function handleUpdateAdminProfile(req: Request, res: Response) {
    await connectToDB();

    const body: AdminUpdateProfileRequest = req.body;

    try {
        const cookie = req.cookies?.jwt_token;
        const userFromToken: jwt.JwtPayload | string = jwt.verify(cookie, process.env.JWT_STRING as Secret);

        // condition never gonna be true, because of middleaware.
        if (typeof userFromToken !== "object" || !userFromToken.id) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const user: IUser | null | undefined = await USER.findOne({ email: userFromToken.email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // create badalje
        const updatedUser = await USER.findOneAndUpdate({
            email: user.email,
        }, {
            username: body.username,
            fullName: body.fullName,
            contact_no: body.contact_no,
            skills: body.skills,
            biography: body.biography,
            socialLinks: body.socialLinks,
        }, {
            new: true,
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const tokenObject: AdminTokenUser = {
            name: updatedUser.fullName,
            role: updatedUser.role,
            username: updatedUser.username,
            email: updatedUser.email,
        }

        const token = signToken(tokenObject);
        return res.cookie("jwt_token", token).status(200).json({ updatedUser: updatedUser });

    } catch (error) {
        console.log(`Unexpected error occured during user update: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });

    } finally {
        await disConnectfromDB();
    }
}


/**
 * 
 * @param req : Express request object
 * @param res : Express response object
 * @returns Codes: {
 *      401 - message: "You're prohibited!",
 *      403 - message: "Forbidden",
 *      500 - message: "Internal server error",
 *      302 - message: "No cookie found"
 *      302 - message: "Error in verifying token"
 *      401 - message: "Unauthorized access, invalid token"
 *      404 - message: "User not found"
 *      404 - projectNotFound:  "Project not found"
 *      200 - message: "Project deleted successfully"
 * }
 */
export async function handleDeleteProject(req: Request, res: Response) {
    const projectId = req.params.projectId;


    const cookie = req.cookies?.jwt_token;
    const userFromToken: jwt.JwtPayload | string = jwt.verify(cookie, process.env.JWT_STRING as Secret);

    // condition never gonna be true, because of middleaware.
    if (typeof userFromToken !== "object" || !userFromToken.id) {
        return res.status(401).json({ message: "Unauthorized access" });
    }


    await connectToDB();

    try {
        const user: IUser | null | undefined = await USER.findOne({ email: userFromToken.email });

        const project = await PROJECT.findOne({ id: projectId });

        if (!project) {
            return res.status(404).json({ projectNotFound: "Project not found" });
        }

        // only organizer can control the project stuff. (delete, 1111111111111update, modify)
        if (user?.role !== 'organizer' && user?.id !== project.organizer) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const deleteProject = await PROJECT.deleteOne({ id: projectId });

        // TODO continue..
        if (deleteProject.acknowledged) {
            return res.status(200).json({ message: "Project deleted successfully" });
        }

    } catch (error) {
        console.log(`Unexpected error occured during deleting the project: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}


// all the upgradation or updation of propfile or project will be handled by the PUT request.
// Now PUT request is all about changing the whole document with another one. so, when the user/faculty want to change something, rest of the fields will remain unchanged. so the request from the frontend should contain all the fields, even if user/faculty want to change something.

// TODO fix this later.
// export async function handleUpdateProject(req: Request, res: Response) {

//     // TODO
//     const body: ProjectCreationDetails = req.body;
//     await connectToDB();

//     try {

//         const startDate = new Date(body.start);
//         const endDate = new Date(body.end);

//         if (startDate.getTime() <= endDate.getTime()) {
//             return res.status(400).json({ dateError: "Start date must be before end date" });
//         }

        

//         const newProject = await PROJECT.create({
//             name: body.name,
//             description: body.description,
//             start: body.start,
//             end: body.end,
//             organizer: req.user?.id,
//             maxParticipants: body.maxParticipants,
//             judges: body.judges,
//             prizes: body.prizes,
//             rulesAndRegulations: body.rulesAndRegulations,
//             theme: body.theme,
//             techTags: body.techTags,
//             status: Date.now() < startDate.getTime() ? 'planned' : 'ongoing',
//         });

//         return res.status(201).json({ message: "Project created!", project: newProject });


//     } catch (error) {
//         console.log(`Error creating project: ${error}`);
//         return res.status(500).json({ error: "Internal server error" });
//     } finally {
//         disConnectfromDB();
//     }

// }


/**
 * 
 * @param req : Express request object
 * @param res : Express response object
 * @returns Codes: {
 *      401 - message: "You're prohibited!",
 *      403 - message: "Forbidden",
 *      500 - message: "Internal server error",
 *      302 - message: "No cookie found"
 *      302 - message: "Error in verifying token"
 *      401 - message: "Unauthorized access, invalid token"
 *      404 - message: "User not found"
 *      404 - projectNotFound:  "Project not found"
 *      200 - allProjects: resultArray
 * }
 */
export async function handleListMyProjects(req: Request, res: Response) {
    await connectToDB();
    const cookie = req.cookies?.jwt_token;
    const userFromToken: jwt.JwtPayload | string = jwt.verify(cookie, process.env.JWT_STRING as Secret);

    // condition never gonna be true, because of middleaware.
    if (typeof userFromToken !== "object" || !userFromToken.id) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    try {
        const user = await USER.findOne({ email: userFromToken.email });

        const projects: IProject[] | null | undefined = await PROJECT.find({ organizer: user?._id });
        
        const resultArray = projects.map(project => {
            return {
                id: project.id,
                name: project.name,
                description: project.description,
                start: project.start,
                end: project.end,
                organizer: project.organizer,
                maxParticipants: project.maxParticipants,
                rulesAndRegulations: project.rulesAndRegulations,
                theme: project.theme,
                techTags: project.techTags,
                status: project.status,
                participantCount: project.participantTeam?.teamMembers.length || 0,
            };
        });
        
        return res.status(200).json({ allProjects: resultArray });

    } catch (error) {
        console.log(`Internal server error while listing all the projects: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        disConnectfromDB();
    }
}
