import { Request, Response, json, response } from "express";
import { IUser } from "../models/user_model";
import USER from "../models/user_model";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import mongoose, { Date } from "mongoose";
import jwt from "jsonwebtoken";
// import { Strategy, ExtractJwt } from "passport-jwt";
import validator from "validator";
import { nanoid } from "nanoid"
import bcrypt from "bcrypt";

export interface TokenUser {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    role: string;
    username: string;
    email: string;
    enrollmentNumber: string;
    verified: boolean;
}

export interface LoginRequestBody {
    enrollmentNumberOrEmail: string;
    password: string;
}

function signToken(user: TokenUser) {
    const token = jwt.sign(user, process.env.JWT_STRING as string, {
        expiresIn: process.env.SESSION_MAX_AGE,
    })

    return token;
}

function tokenCheckUp(token: string) {
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_STRING as string) as TokenUser;
        return decoded;
    } catch (error) {
        console.log(`Token verification failed: ${error}`);
        return false;
    }
}

export async function handleUserSignup(req: Request<{}, {}, IUser>, res: Response) {
    await connectToDB();
    const body: IUser = req.body;
    
    if( !validator.matches(body.email, "scet.ac.in")) {
        return res.status(400).json({ invalidMail: "Please enter only SCET Email address" });
    }

    try {
        const userWithSameEmail = await USER.findOne({ email: body.email });
        const userWithSameUsername = await USER.findOne({ username: body.username });
        const userWithSameEnrollment = await USER.findOne({ enrollmentNumber: body.enrollmentNumber });

        const duplication = {
            email: userWithSameEmail? true : false,
            username: userWithSameUsername? true : false,
            enrollmentNumber: userWithSameEnrollment? true : false,
        };

        if(Object.values(duplication).some(Boolean)) {
            return res.status(400).json({ duplication: duplication });
        }

        const verificationString = await bcrypt.hash(nanoid(40), 10);
        
        const newUser = await USER.create({
            enrollmentNumber: body.enrollmentNumber,
            username: body.username,
            email: body.email,
            password: body.password,
            biography: body.biography,
            fullName: body.fullName,
            contact_no: body.contact_no,
            role: "student",
            skills: body.skills,
            portfolio: body.portfolio,
            socialLinks: {
                linkedin: body.socialLinks?.linkedin,
                github: body.socialLinks?.github,
            },
            verificationCode: verificationString,
            verified: false,
        }) as IUser;

        const tokenObject: TokenUser = {
            _id: newUser._id as mongoose.Schema.Types.ObjectId,
            name: newUser.fullName,
            role: newUser.role,
            username: newUser.username,
            email: newUser.email,
            enrollmentNumber: newUser.enrollmentNumber,
            verified: newUser.verified,
        }

        const token = signToken(tokenObject);
        return res.cookie("jwt_token", token).status(201).json({user: newUser});

    } catch (error) {
        console.log(`Unexpected error occured during user signup: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });

    } finally {
        await disConnectfromDB();
    }
}

export async function handleUserLogin(req: Request<{}, {}, LoginRequestBody>, res: Response) {
    await connectToDB();
    const body: LoginRequestBody = req.body;

    const enrollmentNumberOrEmail = body.enrollmentNumberOrEmail;
    const password = body.password;

    const email = validator.matches(enrollmentNumberOrEmail, "@scet.ac.in");

    if (email) {
        try {
            const user = await USER.findOne({ email: enrollmentNumberOrEmail });

            if (!user) {
                return res.status(404).json({ message: "User Not Found" });
            }
            
            if(password === user.password) {
                const tokenObject: TokenUser = {
                    _id: user._id as mongoose.Schema.Types.ObjectId,
                    name: user.fullName,
                    role: user.role,
                    username: user.username,
                    email: user.email,
                    enrollmentNumber: user.enrollmentNumber,
                    verified: user.verified
                }
                const token = signToken(tokenObject);

                return res.cookie("jwt_token", token).status(200).json({ user: user });
            }

        } catch (error) {
            console.log(`Unexpected error occured during user signup: ${error}`);
            return res.status(500).json({ error: "Internal Server Error" });
        } finally {
            await disConnectfromDB();
        }
    } else {
        try {
            const user = await USER.findOne({ enrollmentNumber: enrollmentNumberOrEmail });

            if (!user) {
                return res.status(404).json({ message: "User Not Found" });
            }
            
            if(password === user.password) {
                const tokenObject: TokenUser = {
                    _id: user._id as mongoose.Schema.Types.ObjectId,
                    name: user.fullName,
                    role: user.role,
                    username: user.username,
                    email: user.email,
                    enrollmentNumber: user.enrollmentNumber,
                    verified: user.verified,
                }
                const token = signToken(tokenObject);

                return res.cookie("jwt_token", token).status(200).json({ user: user });
            }

        } catch (error) {
            console.log(`Unexpected error occured during user signup: ${error}`);
            return res.status(500).json({ error: "Internal Server Error" });
        } finally {
            await disConnectfromDB();
        }
    }
}

export function handleUserLogout(req: Request, res: Response) {
    res.clearCookie("jwt_token", {
        httpOnly: true, // if it was set with httpOnly
        secure: true, // if it was set with secure flag
        sameSite: 'strict', // if it was set with sameSite
        path: '/', // should match the path the cookie was set with
    });

    return res.status(200).json({ message: "Logged out successfully" });
}

export async function handleUserProfile(req: Request, res: Response) {
    await connectToDB();

    const cookie = req.cookies?.jwt_token;
    const username: string = req.params.username;
    const tokenUser = tokenCheckUp(cookie);

    try {
        const user = await USER.findOne({ username: username });

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if( tokenUser && tokenUser.username === user.username ) {
            return res.status(200).json({ ...user, selfProfile: true })
        } else {
            return res.status(200).json({ ...user, selfProfile: false });
        }
        
    } catch (error) {
        console.log(`Unexpected error occured: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        await disConnectfromDB();
    }
}



export async function handleVerifyUserEmail(req: Request, res: Response) {
    const currentTime: number = Date.now();
    const verificationString: string = req.params.verificationId;

    await connectToDB();

    try {
        const user: IUser | null = await USER.findOne(
            { 'verificationCode.code': verificationString },
        );

        if( !user ) {
            return res.status(404).json({ error: "Invalid verification URL" });
        }

        const differenceInMilliseconds = currentTime - user.verificationCode?.createdAt;
        const differenceInMinutes: number = Math.floor((differenceInMilliseconds) / (1000*60));

        if( differenceInMinutes > 20 ) {
            return res.status(400).json({ error: "Verification link expired" });
        }

        const updatedUser = await USER.findByIdAndUpdate(user._id, 
            { $set: { verified: true } },
            { new: true },
        );

        if (!updatedUser) {
            return res.status(500).json({ error: "Failed to update user verification status" });
        }

        /*
            replacing the old cookie (which contained the verified field false) with the new cookie with the same name "jwt_token"(contains the same cookie, but with verified field true).
        */
        res.clearCookie("jwt_token", {
            httpOnly: true, // if it was set with httpOnly
            secure: true, // if it was set with secure flag
            sameSite: 'strict', // if it was set with sameSite
            path: '/', // should match the path the cookie was set with
        });

        const tokenObject: TokenUser = {
            _id: updatedUser._id as mongoose.Schema.Types.ObjectId,
            name: updatedUser.fullName,
            role: updatedUser.role,
            username: updatedUser.username,
            email: updatedUser.email,
            enrollmentNumber: updatedUser.enrollmentNumber,
            verified: updatedUser.verified,
        }

        const token = signToken(tokenObject);

        return res.cookie("jwt_token", token).status(200).json({ message: "Email verified successfully!" });

    } catch (error) {
        console.log(`Unexpected error occured: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        disConnectfromDB();
    }
}