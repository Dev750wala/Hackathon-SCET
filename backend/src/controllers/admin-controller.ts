import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken"
import USER from "../models/user-model";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import validator from "validator";
import bcrypt from "bcrypt"
import { nanoid } from "../utilities/nanoid";
import PROJECT from "../models/project-model";
// Admin interfaces
import { AdminTokenUser, AdminLoginRequestBody, AdminPayload, AdminUpdateProfileRequest, AdminSignupDetails } from "../interfaces/admin-interfaces";
import { ProjectCreationDetails, IProject } from "../interfaces/project-interfaces";
import { IUser, TokenUser } from "../interfaces/user-interfaces";
import { handleErrors, handleProjectErrors } from "../utilities/handleErrors";
import { Types } from "mongoose";

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

    if (req.user?.role === "student") {
        return res.status(401).json({ message: "You're prohibited!" });
    }



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
    res.cookie("admin", token, { httpOnly: true, maxAge: 1000 * 60 * 60 });
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

    // console.log(req.body);


    const { username, email, password, fullName, contact_no, skills, biography, portfolio, socialLinks }: AdminSignupDetails = req.body;

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
            portfolio: portfolio,
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

        if (err.general.includes("An internal server error occurred.") || err.general.includes("An unexpected error occurred.")) {
            return res.status(500).json({ serverError: err });

        } else {
            return res.status(400).json({ signupErrors: err });
        }

    } 
    // finally {
    //     disConnectfromDB();
    // }
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
    try {
    const body: AdminLoginRequestBody = req.body;

        const user: IUser = await USER.adminLogin(body);

        const tokenObject: AdminTokenUser = {
            name: user.fullName,
            role: user.role,
            username: user.username,
            email: user.email,
        }
        const token = signToken(tokenObject);

        const responseData = {
            username: user.username,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            contact_no: user.contact_no,
            skills: user.skills,
            biography: user.biography,
            portfolio: user.portfolio,
            socialLinks: user.socialLinks,
            verified: user.verified,
            registrationDate: user.registrationDate,
            participationHistory: user.participationHistory,
            availability: user.availability
        }

        return res.cookie("jwt_token", token, { maxAge: 60 * 60 * 60 * 1000 }).status(200).json({ user: responseData });

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
 * Handles the creation of a new project.
 *
 * @param req - The Express request object.
 * @param res - The Express response object.
 *
 * @returns {Promise<Response>} - Returns a Promise that resolves to an Express response object.
 * The response object will contain a status code of 201 if the project is created successfully,
 * and a JSON object containing the project's information. If the project creation fails,
 * the response object will contain a status code of 400 or 500 and an error message.
 */
export async function handleCreateProject(req: Request, res: Response): Promise<Response> {
    const body: ProjectCreationDetails = req.body;

    try {
        const id = nanoid(15);

        const registrationStartDate = new Date(body.registrationStart);
        const registrationEndDate = new Date(body.registrationEnd);
        const startDate = new Date(body.start);
        // const endDate = new Date(body.end);

        const currentDate = new Date();
        if (!(currentDate.getTime() < registrationStartDate.getTime() &&
            registrationStartDate.getTime() < registrationEndDate.getTime() &&
            registrationEndDate.getTime() < startDate.getTime())) {
            return res.status(400).json({ dateError: "Please select valid dates" });
        }

        console.log("Hello World1 -------------------------------------------------------------");

        let newProject: IProject = await PROJECT.create({
            id: id,
            name: body.name,
            description: body.description,
            registrationStart: body.registrationStart,
            registrationEnd: body.registrationEnd,
            start: body.start,
            organizer: req.user?._id,
            maxParticipants: body.maxParticipants,
            judges: body.judges,
            prizes: body.prizes,
            rulesAndRegulations: body.rulesAndRegulations,
            theme: body.theme,
            techTags: body.techTags,
            status: currentDate.getTime() < startDate.getTime() ? 'planned' : 'ongoing',
        })

        console.log("Hello World2 -------------------------------------------------------------");


        const { _id, __v, ...finalResponse }: IProject = newProject.toObject();

        return res.status(201).json({ message: "Project created!", project: finalResponse });

    } catch (error) {
        console.log(`Error creating project: ${error}`);
        const errors = handleProjectErrors(error);
        return res.status(errors.statusCode).json({ error: errors });
    } 
    // finally {
    //     disConnectfromDB();
    // }
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
export async function handleUpdateUserProfile(req: Request, res: Response) {

    const allowedUpdates = [
        'username',
        'password',
        'fullName',
        'contact_no',
        'skills',
        'biography',
        'portfolio',
        'linkedin',
        'github',
        'availability'
    ];

    try {
        const updates: Partial<IUser> = req.body;

        if ("username" in updates) {
            const userWithSameUsername = await USER.findOne({ username: updates.username });
            if (userWithSameUsername) {
                return res.status(400).json({ duplication: "Username already exists" });
            }
        }

        // Filter out unwanted fields from updates
        const filteredUpdates: Partial<IUser> = {};
        Object.keys(updates).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key as keyof IUser] = updates[key as keyof IUser];
            }
        });

        // If user is trying to update password, hash it before saving
        // if (filteredUpdates.password) {
        //     const salt = await bcrypt.genSalt(10);
        //     filteredUpdates.password = await bcrypt.hash(filteredUpdates.password, salt);
        // }



        const updatedUser = await USER.findByIdAndUpdate(
            req.user?._id as Types.ObjectId,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user: updatedUser });

    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } 
    // finally {
    //     disConnectfromDB();
    // }
}


/**
 * @param {Request} req - The request object, containing the project ID in the URL parameters and the user information.
 * @param {Response} res - The response object, used to send back the appropriate HTTP status and message.
 * 
 * @throws {Error} - If an unexpected error occurs during the process, a 500 Internal Server Error is returned.
 */
export async function handleDeleteProject(req: Request, res: Response) {
    const projectId = req.params.projectId;

    try {
        // Find the project by its ID
        const projectToDelete = await PROJECT.findOne({ id: projectId });

        // If the project does not exist, return a 404 Not Found response
        if (!projectToDelete) {
            return res.status(404).json({ projectNotFound: "Project not found" });
        }

        // Check if the requesting user is the owner of the project
        if (!projectToDelete.organizer.equals(req.user?._id as Types.ObjectId)) {
            return res.status(403).json({ message: "Forbidden! You're not the owner of the project" });
        }

        // Delete the project
        const deletedProject = await PROJECT.deleteOne({ id: projectId });

        // If the project could not be deleted, return a 404 Not Found response
        if (!deletedProject) {
            return res.status(404).json({ projectNotFound: "Project not found" });
        }

        // Return a 200 OK response indicating the project was deleted successfully
        return res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        // Log the error and return a 500 Internal Server Error response
        console.log(`Unexpected error occurred during project deletion: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } 
    // finally {
    //     // Disconnect from the database
    //     disConnectfromDB();
    // }
}

/**
 * Handles the update of a project and admin profile.
 * 
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response indicating the success or failure of the project updation.
 * @throws If there is an error creating the project, an internal server error is returned.
 */
export async function handleUpdateProject(req: Request, res: Response) {

    const projectId = req.params.projectId;
    const updates: Partial<IProject> = req.body;

    const allowedUpdates = [
        'name',
        'description',
        'start',
        'maxParticipants',
        'judges',
        'prizes',
        'rulesAndRegulations',
        'theme',
        'techTags',
    ];

    try {
        const project = await PROJECT.findOne({ id: projectId });

        if (!project) {
            return res.status(404).json({ projectNotFound: "Project not found" });
        }

        if (!project.organizer.equals(req.user?._id as Types.ObjectId)) {
            // console.log(project.organizer);
            // console.log(req.user?._id);
            return res.status(403).json({ message: "Forbidden! you're not a owner of the project" });
        }

        // aa concept hamna baju ma rakh, k project jo complete thai gayo hoi to ene edit nai kari sakay. that, we'll see later.
        // const currentDate = new Date();
        // if (currentDate.getTime() > project.end.getTime()) {
        //     return res.status(403).json({ message: "You can't update the project after it's ended" });
        // }

        const filteredUpdates: Partial<IProject> = {};
        Object.keys(updates).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                filteredUpdates[key as keyof IProject] = updates[key as keyof IProject];
            }
        });

        const updatedProject = await PROJECT.findOneAndUpdate(
            { id: projectId },
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        );

        return res.status(200).json(updatedProject);

    } catch (error) {
        const errorObject = handleProjectErrors(error);
        console.log(`Error creating project: ${JSON.stringify(errorObject)}`);
        return res.status(500).json({ error: errorObject });
    } 
    // finally {
    //     disConnectfromDB();
    // }
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
 *      200 - allProjects: resultArray
 * }
 */
export async function handleListMyProjects(req: Request, res: Response) {

    try {
        const projects: IProject[] | null | undefined = await PROJECT.find({ organizer: req.user?._id as Types.ObjectId });

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
                participantCount: project.participantTeam.length,
            };
        });

        return res.status(200).json({ allProjects: resultArray });

    } catch (error) {
        console.log(`Internal server error while listing all the projects: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    }
    // finally {
    //     disConnectfromDB();
    // }
}
