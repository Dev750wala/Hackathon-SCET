import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import USER from "../models/user_model";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import validator from "validator";
import bcrypt from "bcrypt"
import { nanoid } from "../utilities/nanoid";
// Admin interfaces
import { AdminTokenUser, AdminLoginRequestBody } from "../interfaces/admin-interafaces";
import { ProjectCreationDetails, IProject } from "../interfaces/project-interfaces";

function signToken(user: AdminTokenUser) {
    const token = jwt.sign(user, process.env.ADMIN_JWT_STRING as string, {
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

    if (!password) return res.status(400).json({ message: "Password is required" });

    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ message: "Invalid admin password" });

    const token = jwt.sign(
        { isAdmin: true },
        process.env.ADMIN_JWT_STRING,
        { expiresIn: '1h' }
    );

    // admin_token
    res.cookie("admin_jwt_token", token, { httpOnly: true });
    return res.status(200).json({ message: "Authenticated successfully" });
}

/**
 * at the path /admin/signup
 * @param req 
 * @param res 
 * @returns Codes: { 
 *                  201: "created successfully"
 *                  400: "Invalid email"
 *                  401: "Admin cookie not found", 
 *                  403: "Not a admin", 
 *                  500: "Internal server error" 
 *                  }
 */
export async function handleAdminSignup(req: Request, res: Response) {
    await connectToDB();

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
        return res.cookie("admin_jwt_token", token).status(201).json({ user: newUser });

    } catch (error) {
        console.log(`Unexpected error occured during user signup: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });

    } finally {
        await disConnectfromDB();
    }
}



/**
 * at the path /admin/login
 * @param req 
 * @param res 
 * @returns Codes: { 
 *                  200: "good to go",
 *                  404: "user not found"
 *                  401: "Admin cookie not found", 
 *                  403: "Not a admin", 
 *                  500: "Internal server error" 
 *                  }
 */
export async function handleAdminLogin(req: Request, res: Response) {
    await connectToDB();
    const body: AdminLoginRequestBody = req.body;

    const emailOrUsername = body.emailOrUsername;
    const password = body.password;

    const email = validator.matches(emailOrUsername, "@scet.ac.in");

    try {
        const user = await USER.findOne(
            {
                $or: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ]
            },
        );

        if (!user) {
            return res.status(404).json(
                { message: `${email ? "Email" : "Username"} not found` }
            );
        }

        if (password === user.password) {
            const tokenObject: AdminTokenUser = {
                name: user.fullName,
                role: user.role,
                username: user.username,
                email: user.email,
            }
            const token = signToken(tokenObject);

            return res.cookie("admin_jwt_token", token).status(200).json({ user: user });
        }

    } catch (error) {
        console.log(`Unexpected error occured during user signup: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await disConnectfromDB();
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
    res.clearCookie("admin_jwt_token", { httpOnly: true, secure: true, sameSite: 'strict' });

    return res.status(200).json({ message: "Logged out successfully" });
}


export async function handleCreateProject(req: Request, res: Response) {
    const body: ProjectCreationDetails = req.body;

    await connectToDB();

    try {
        // const newProject = await 
    } catch (error) {
        
    }
}


export async function handleUpdateAdminProfile(req: Request, res: Response) {

}


export async function handleDeleteProject(req: Request, res: Response) {

}


export async function handleUpdateProject(req: Request, res: Response) {

}


export async function handleListMyProjects(req: Request, res: Response) {

}

