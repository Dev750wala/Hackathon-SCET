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
import { TokenUser, LoginRequestBody, SignupDetails, IUser, SocialLinks, SignupResponse } from "../interfaces/user-interfaces";
import { handleErrors } from "../utilities/handleErrors";
// import PROJECT from "../models/project-model";
import { AdminPayload } from "../interfaces/admin-interfaces";
import PROJECT from "../models/project-model";
import { IProject, ParticipationTeam, ParticipationTeamRequestInterface } from "../interfaces/project-interfaces";

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
    console.log(body);


    if (!validator.matches(body.email, "scet.ac.in")) {
        return res.status(400).json({ invalidMail: "Please enter only SCET Email address" });
    }

    try {
        // TODO uncomment this after a while

        const userWithSameEmail = await USER.findOne({ email: body.email });
        const userWithSameUsername = await USER.findOne({ username: body.username });
        const userWithSameEnrollment = await USER.findOne({ enrollmentNumber: body.enrollmentNumber });

        const duplication = {
            email: userWithSameEmail ? true : false,
            username: userWithSameUsername ? true : false,
            enrollmentNumber: userWithSameEnrollment ? true : false,
        };

        if (Object.values(duplication).some(Boolean)) {
            return res.status(400).json({ duplication: duplication });
        }

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

        const responseData = {
            enrollmentNumber: newUser.enrollmentNumber,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            fullName: newUser.fullName,
            contact_no: newUser.contact_no,
            skills: newUser.skills,
            biography: newUser.biography,
            portfolio: newUser.portfolio,
            socialLinks: newUser.socialLinks,
            verified: newUser.verified,
            registrationDate: newUser.registrationDate,
            participationHistory: newUser.participationHistory,
            availability: newUser.availability
        }

        const token = signToken(tokenObject);
        sendMail(newUser, null, null, "verify");
        res.cookie("jwt_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
        });
        console.log("\n\nCookie sent: ", token, "\n\n");

        return res.status(201).json({ user: responseData, message: "Please check your mail inbox to verify your mail!" });

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

    try {
        const user: IUser = await USER.userLogin(body);

        const responseData = {
            enrollmentNumber: user.enrollmentNumber,
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

        const tokenObject: TokenUser = {
            name: user.fullName,
            role: user.role,
            username: user.username,
            email: user.email,
            enrollmentNumber: user.enrollmentNumber,
            verified: user.verified
        }
        const token = signToken(tokenObject);
        // TODO login kare to eno mail aave evu continue karje aiya thi
        return res.cookie("jwt_token", token).status(200).json({ user: responseData });
    }

    catch (error) {
        // console.log(`Unexpected error occured during user signup: ${error}`);
        const errors = handleErrors(error, "student");
        return res.status(errors.statusCode).json({ error: errors });
    } finally {
        await disConnectfromDB();
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

    const cookies = req.cookies;
    if (!cookies) {
        return res.status(401).json({ message: "No token found" });
    }
    if (req.cookies.admin) {
        res.clearCookie("admin", {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
        });
    }

    res.clearCookie("jwt_token", {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
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
    try {
        await connectToDB();
        const username: string = req.params.username;

        if (mongoose.connection.readyState !== 1) {
            console.log("Failed to connect to the database");
            return res.status(500).json({ error: 'Failed to connect to the database' });
        }

        const user = await USER.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const responseData = {
            enrollmentNumber: user.enrollmentNumber,
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
        return res.status(200).json({ user: responseData, selfProfile: req.user && req.user?.username === responseData.username ? true : false });

    } catch (error) {
        console.log(`Unexpected error occured: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        console.log("Hefdfdfdsggsgfsgsfg");
        disConnectfromDB();
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
            verified: true,
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


export async function handleParticipateInProject(req: Request, res: Response) {
    // console.log("hello world");
    const projectId = req.params.projectId;
    const username = req.params.username;
    const body: ParticipationTeamRequestInterface = req.body;
    try {
        await connectToDB();

        const project = await PROJECT.findOne({ id: projectId });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        let userAlreadyParticipated = false;
        const user = await USER.findOne({ username: username })

        for (const team of project.participantTeam) {
            for (const member of team.teamMembers) {
                if (member.id.equals(user?.id) && member.participatingStatus === 'accepted') {
                    userAlreadyParticipated = true;
                }
            }
        }
        if (userAlreadyParticipated) {
            return res.status(400).json({ message: "User already participated in this project" });
        }
        const memberLookup = await USER.find({ username: { $in: body.teamMembers.map(member => member.username) } });

        const finalDataToInsert: ParticipationTeam = {
            name: body.name,
            description: body.description,
            teamMembers: body.teamMembers.map(member => {
                const foundMember: IUser = memberLookup.find(dbMember => dbMember.username === member.username) as IUser;
                return {
                    id: foundMember._id as mongoose.Types.ObjectId,
                    name: member.fullName,
                    participatingStatus: member.participatingStatus,
                };
            }).filter(member => member.id !== null),
        };
        const updatedProject = await PROJECT.findOneAndUpdate({ id: projectId }, {
            $push: { participantTeam: finalDataToInsert },
        }, { new: true });

        if (!updatedProject) {
            return res.status(500).json({ message: "Failed to participate in the project" });
        }

        const allMembers = await USER.find({ _id: { $in: finalDataToInsert.teamMembers.map(member => member.id)}});
        allMembers.map(async (member) => {
            const updatedMember: IUser | null = await USER.findByIdAndUpdate(member.id, {
                $push: { participationHistory: { 
                    eventId: updatedProject.id,
                    name: updatedProject.name,
                }},
            }, { new: true });
        })
        

    } catch (error) {

    }
}


export async function verifyUserFromToken(req: Request, res: Response) {
    const jwt_token: string | undefined = req.cookies.jwt_token;
    const adminToken: string | undefined = req.cookies.admin;

    let userResponse: any = null;
    let isAdmin: boolean | null = null;

    if (!jwt_token && !adminToken) {
        return res.status(401).json({
            user: null,
            isAdmin: false,
            message: "No tokens provided",
        });
    }

    // await connectToDB();

    try {
        if (jwt_token) {
            const decodedToken: TokenUser | false = tokenCheckUp(jwt_token);
            if (!decodedToken) {
                if (adminToken) {
                    try {
                        const decodedAdminToken = jwt.verify(adminToken, process.env.JWT_STRING as string) as AdminPayload;
                        isAdmin = decodedAdminToken.isAdmin;
                    } catch (error) {
                        return res.status(403).json({
                            user: null,
                            isAdmin: false,
                            message: "Admin token verification failed",
                        });
                    }
                }
                return res.status(403).json({
                    user: null,
                    isAdmin: false,
                    message: "Invalid user token",
                });
            }

            const user = await USER.findOne({ email: decodedToken.email });
            if (user) {
                userResponse = {
                    enrollmentNumber: user.enrollmentNumber,
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
                    availability: user.availability,
                };
            }
        }

        if (adminToken) {
            try {
                const decodedAdminToken = jwt.verify(adminToken, process.env.JWT_STRING as string) as AdminPayload;
                isAdmin = decodedAdminToken.isAdmin;
            } catch (error) {
                return res.status(403).json({
                    user: userResponse,
                    isAdmin: false,
                    message: "Admin token verification failed",
                });
            }
        }

        return res.status(200).json({
            user: userResponse,
            isAdmin: isAdmin ?? false,
        });

    } catch (error) {
        return res.status(500).json({
            user: null,
            isAdmin: false,
            message: "Some error occurred",
        });
    }
}

export async function handleShowProjectDetails(req: Request, res: Response) {
    await connectToDB();
    const projectId: string = req.params.projectId;

    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("Failed to connect to the database");
            return res.status(500).json({ error: 'Failed to connect to the database' });
        }

        const project: IProject | null = await PROJECT.findOne({ id: projectId }).exec();
        if (!project) {
            return res.status(404).json({ message: "project not found" });
        }
        const organizer = await USER.findById(project.organizer);
        if (!organizer) {
            return res.status(404).json({ message: "Organizer not found" });
        }
        const judgeUserIds = project.judges
            .filter(judge => judge.userId)
            .map(judge => judge.userId);

        const judges = await USER.find({ _id: { $in: judgeUserIds } }).select('fullName username').exec();
        const judgesWithDetails = project.judges.map(judge => {
            const user = judges.find(u => u.id.toString() === judge.userId?.toString());
            return {
                name: judge.name,
                userDetails: user ? {
                    fullName: user.fullName,
                    username: user.username
                } : null
            };
        });

        const responseData = {
            id: project.id,
            name: project.name,
            description: project.description,
            registrationStart: project.registrationStart,
            registrationEnd: project.registrationEnd,
            start: project.start,
            end: project.end,
            organizer: {
                username: organizer.username,
                fullName: organizer.fullName,
            },
            maxParticipants: project.maxParticipants,
            judges: judgesWithDetails,
            prizes: project.prizes,
            rulesAndRegulations: project.rulesAndRegulations,
            theme: project.theme,
            techTags: project.techTags,
            totalTeams: project.participantTeam.length,
            status: project.status,
        }

        return res.status(200).json({ project: responseData, selfOrganized: (project.organizer === req.user?._id) ? true : false });

    } catch (error) {
        console.log(`Unexpected error occured: ${error}`);
        return res.status(500).json({ error: "Internal Server Error" });
    } finally {
        disConnectfromDB();
    }
}


export async function handleReviewCollabProposal (req: Request, res: Response) {
    try {
        await connectToDB();
        const projectId: string = req.params.projectId;
        const recipientId: string = req.params.recipientId;
        const reviewCode = req.params.reviewCode;
        
        if (recipientId !== req.user?.username) {
            return res.status(400).json({ message: "INVALID URL" }).redirect(`${process.env.FRONTEND_URL}/user/login`);
        }
        if (!projectId || !recipientId || !reviewCode) {
            return res.status(400).json({ message: "Invalid request" });
        }
        if (reviewCode !== "f3b42cb0cb114a408139735f762ab9b6r" && reviewCode !== "6d0373a2e96149859786420dc6873457a") {
            return res.status(400).json({ message: " INVALID URL" });
        }
        
        const project = await PROJECT.findOne({ id: projectId });
        if (!project) {
            return res.status(404).json({ message: "INVALID URL" });
        }
        if (new Date().getTime() > new Date(project.registrationEnd).getTime()) {
            return res.status(400).json({ message: "Registration period has ended" });
        }
        const recipient: IUser | null | undefined= await USER.findOne({ username: recipientId });
        if (!recipient) {
            return res.status(404).json({ message: "INVALID URL" });
        }
        const userInProjectTeams = project.participantTeam.map(team => team.teamMembers.some(member => member.id.equals(recipient._id as mongoose.Types.ObjectId)));
        if (!userInProjectTeams) {
            return res.status(400).json({ message: "YOU ARE NOT IN THIS PROJECT" });
        }

        for (const team of project.participantTeam) {
            for (const member of team.teamMembers) {
                if (member.id.equals(recipient._id as mongoose.Types.ObjectId)) {
                    if (member.participatingStatus === "accepted") {
                        return res.status(400).json({ message: "You have already reviewed" });
                    } else {
                        if (reviewCode === "6d0373a2e96149859786420dc6873457a") {
                            member.participatingStatus = "accepted";
                        } else {
                            team.teamMembers = team.teamMembers.filter(member => !member.id.equals(recipient._id as mongoose.Types.ObjectId));
                        }
                        break;
                    }
                }
            }
        }
        const updatedProject = await PROJECT.findOneAndUpdate({ id: projectId }, project, 
            {new: true}
        );
        if (!updatedProject) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
        return res.status(200).json({ message: "Successfully accepted the proposal" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}