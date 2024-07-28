import { Request, Response, json, response } from "express";
import USER from "../models/user-model";
import { connectToDB, disConnectfromDB } from "../utilities/connection";
import mongoose, { Date } from "mongoose";
import jwt from "jsonwebtoken";
// import { Strategy, ExtractJwt } from "passport-jwt";
import validator from "validator";
import { nanoid } from "../utilities/nanoid";
import bcrypt from "bcrypt";
import { sendMail } from "../utilities/mail";
import { TokenUser, LoginRequestBody, SignupDetails, IUser, SocialLinks } from "../interfaces/user-interfaces";
import { handleErrors } from "../utilities/handleErrors";


/**
 * Generates a JWT token for the provided user.
 *
 * This function takes a user object as input, signs it using the JWT secret, and sets the token expiration time.
 * The token is then returned.
 *
 * @param user - The user object for whom the JWT token needs to be generated.
 *
 * @returns - The generated JWT token.
 *
 * @throws - Throws an error if the JWT secret is not provided.
 */
function signToken(user: TokenUser) {
    const token = jwt.sign(user, process.env.JWT_STRING as string, {
        expiresIn: process.env.SESSION_MAX_AGE,
    })

    return token;
}


/**
 * Verifies and decodes a JWT token.
 *
 * This function takes a JWT token as input, verifies its authenticity using the provided JWT secret,
 * and decodes the token to extract the user information. If the token is invalid or expired, it logs
 * an error message and returns `false`.
 *
 * @param token - The JWT token to be verified and decoded.
 *
 * @returns - The decoded user information if the token is valid and not expired. Otherwise, it returns `false`.
 *
 * @throws - Throws an error if the JWT secret is not provided.
 */
function tokenCheckUp(token: string) {

    try {
        const decoded = jwt.verify(token, process.env.JWT_STRING as string) as TokenUser;
        return decoded;
    } catch (error) {
        console.log(`Token verification failed: ${error}`);
        return false;
    }
}


/**
 * Handles user signup requests.
 *
 * @remarks
 * This function is responsible for processing user signup requests. It validates the request body,
 * checks for duplicate user entries, creates a new user document in the database, sends a verification
 * email, and returns a response with the user details and a verification message.
 *
 * @param req - The Express request object containing the user signup details.
 * @param res - The Express response object to send the response.
 *
 * @returns - An Express response object with appropriate status code and JSON payload.
 *
 * @throws - Throws an error if any unexpected error occurs during the signup process.
 */
export async function handleUserSignup(req: Request, res: Response) {
    await connectToDB();
    const body: SignupDetails = req.body;
    // console.log(body);

    if (!validator.matches(body.email, "scet.ac.in")) {
        return res.status(400).json({ invalidMail: "Please enter only SCET Email address" });
    }

    try {
        // TODO uncomment this after a while

        // const userWithSameEmail = await USER.findOne({ email: body.email });
        // const userWithSameUsername = await USER.findOne({ username: body.username });
        // const userWithSameEnrollment = await USER.findOne({ enrollmentNumber: body.enrollmentNumber });

        // const duplication = {
        //     email: userWithSameEmail ? true : false,
        //     username: userWithSameUsername ? true : false,
        //     enrollmentNumber: userWithSameEnrollment ? true : false,
        // };

        // if (Object.values(duplication).some(Boolean)) {
        //     return res.status(400).json({ duplication: duplication });
        // }

        const verificationString = nanoid(40);

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
            'verificationCode.code': verificationString,
            'verificationCode.createdAt': Date.now(),
            verified: false,
        }) as IUser;

        const tokenObject: TokenUser = {
            name: newUser.fullName,
            role: newUser.role,
            username: newUser.username,
            email: newUser.email,
            enrollmentNumber: newUser.enrollmentNumber,
            verified: newUser.verified,
        }

        const token = signToken(tokenObject);
        sendMail(newUser);
        return res.cookie("jwt_token", token).status(201).json({ user: newUser, message: "Please check your mail inbox to verify your mail!" });

    } catch (error: unknown) {
        console.log(`Unexpected error occured during user signup: ${error}\n\n`);
        const err = handleErrors(error, "student");

        console.log(`hello world   ${JSON.stringify(err)}\n\n`);

        if (err.general.includes("An internal server error occurred.") || err.general.includes("An unexpected error occurred.")) {
            return res.status(500).json({ serverError: err });

        } else {
            return res.status(400).json({ signupErrors: err });
        }

    } finally {
        await disConnectfromDB();
    }
}


/**
 * Handles user login requests.
 *
 * This function processes user login requests by validating the provided credentials,
 * checking the database for a matching user, and generating a JWT token for successful login.
 *
 * @param req - The Express request object containing the user login details.
 * @param res - The Express response object to send the response.
 *
 * @returns - An Express response object with appropriate status code and JSON payload.
 *
 * @throws - Throws an error if any unexpected error occurs during the login process.
 */
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

            if (password === user.password) {
                const tokenObject: TokenUser = {
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

            if (password === user.password) {
                const tokenObject: TokenUser = {
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



/**
 * Handles user logout requests.
 *
 * This function clears the JWT token cookie from the client's browser, effectively logging out the user.
 * It sends a response with a success message and a status code of 200.
 *
 * @param req - The Express request object containing the user's request.
 * @param res - The Express response object to send the response.
 *
 * @returns - An Express response object with a status code of 200 and a JSON payload containing a success message.
 */
export function handleUserLogout(req: Request, res: Response) {
    res.clearCookie("jwt_token", {
        httpOnly: true, // if it was set with httpOnly
        secure: true, // if it was set with secure flag
        sameSite: 'strict', // if it was set with sameSite
        path: '/', // should match the path the cookie was set with
    });

    return res.status(200).json({ message: "Logged out successfully" });
}



/**
 * Handles user profile retrieval requests.
 *
 * This function retrieves the user profile based on the provided username and JWT token.
 * It checks if the user exists in the database, verifies the JWT token, and returns the user profile
 * with an additional `selfProfile` flag indicating whether the user is viewing their own profile.
 *
 * @param req - The Express request object containing the user's request.
 * @param res - The Express response object to send the response.
 *
 * @returns - An Express response object with appropriate status code and JSON payload.
 *  - If the user is found and the JWT token is valid, it returns a 200 status code with the user profile.
 *  - If the user is not found, it returns a 404 status code with a "User not found" message.
 *  - If an unexpected error occurs, it returns a 500 status code with an "Internal Server Error" message.
 *
 * @throws - Throws an error if any unexpected error occurs during the profile retrieval process.
 */
export async function handleUserProfile(req: Request, res: Response) {
    await connectToDB();

    const cookie = req.cookies?.jwt_token;
    const username: string = req.params.username;
    const tokenUser = tokenCheckUp(cookie);

    try {
        const user = await USER.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (tokenUser && tokenUser.username === user.username) {
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




/**
 * Handles the verification of user emails.
 *
 * This function is responsible for verifying user emails by checking the provided verification code
 * against the user's record in the database. If the verification code matches, it updates the user's
 * verification status and returns a success response. If the verification code does not match or
 * the user does not exist, it returns an appropriate error response.
 *
 * @param req - The Express request object containing the user's request.
 * @param res - The Express response object to send the response.
 *
 * @returns - An Express response object with appropriate status code and JSON payload.
 *  - If the verification is successful, it returns a 200 status code with a success message.
 *  - If the verification code is invalid or the user does not exist, it returns a 400 status code with an error message.
 *  - If an unexpected error occurs, it returns a 500 status code with an "Internal Server Error" message.
 *
 * @throws - Throws an error if any unexpected error occurs during the verification process.
 *
 * @note - the feature is still to be implemented a time limit of 15 minutes for email verification.
 *         After 15 minutes of sending the verification email, the user will not be able to verify their email with that link.
 */
export async function handleVerifyUserEmail(req: Request, res: Response) {
    const currentTime: number = Date.now();
    const verificationString: string = req.params.verificationCode;
    const usernameInParam: string = req.params.username;

    await connectToDB();

    try {
        const user: IUser | null = await USER.findOne(
            { username: usernameInParam },
        );

        if (!user) {
            return res.status(404).json({ error: "Invalid verification URL" });
        }

        if (user.verificationCode?.code !== verificationString) {
            return res.status(400).json({ error: "Invalid verification code" });
        }
        // return res.status(200).json({ message: "Email verified successfully" });

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
            name: updatedUser.fullName,
            role: updatedUser.role,
            username: updatedUser.username,
            email: updatedUser.email,
            enrollmentNumber: updatedUser.enrollmentNumber,
            verified: updatedUser.verified,
        }

        const token = signToken(tokenObject);

        return res.cookie("jwt_token", token).status(200).json({ message: "Email verified successfully!" });

        // const differenceInMilliseconds = currentTime - user.verificationCode?.createdAt;
        // const differenceInMinutes: number = Math.floor((differenceInMilliseconds) / (1000 * 60));

        // if (differenceInMinutes > 20) {
        //     return res.status(400).json({ error: "Verification link expired" });
        // }

    } catch (error) {
        console.log(`Unexpected error occured: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });

    } finally {
        disConnectfromDB();
    }
}