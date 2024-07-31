import mongoose from "mongoose";
import { IUser, LoginRequestBody, UserModel } from "../interfaces/user-interfaces";
import { AdminLoginRequestBody } from "../interfaces/admin-interafaces";
import { connectToDB, disConnectfromDB } from "../utilities/connection";


const userSchema = new mongoose.Schema<IUser>({
        enrollmentNumber: {
            type: String,
            minlength: [11, "enrollment must be of 11 characters"]
        },
        username: {
            type: String,
            unique: true,
            required: true,
            minlength: [7, "username must be atleast of 7 characters"],
            maxlength: [20, "username must be maximum of 20 characters"],
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            minlength: [10, "minimum password length is 10"],
            maxlength: [30, "maximum password length is 30"],
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['student', 'organizer',],
        },
        fullName: {
            type: String,
            required: true,
        },
        profile_pic: {
            type: String,
        },
        contact_no: {
            type: String,
        },
        skills: {
            type: [String],
        },
        biography: {
            type: String
        },
        portfolio: {
            type: String
        },
        socialLinks: {
            linkedin: {
                type: String
            },
            github: {
                type: String,
            },
        },
        participationHistory: [{
            eventName: {
                type: String,
            },
            date: {
                type: String
            },
            awards: {
                type: [String],
            }
        }],
        availability: {
            type: Boolean,
            default: false,
        },
        registrationDate: {
            type: Date,
            default: Date.now(),
        },
        verified: {
            type: Boolean,
            default: false,
        },
        // string will be here to store the verification string temporarily till the new user clickks in on the verification mail.
        verificationCode: {
            code: {
                required: true,
                type: String,
            },
            createdAt: {
                type: Number,
                required: true,
                default: Date.now(),
            },
        }
    }, { timestamps: true },
);

userSchema.index(
    { enrollmentNumber: 1 },
    {
        unique: true,
        partialFilterExpression: { role: 'student' }
    }
);

/**
 * This function is a Mongoose pre-save hook that validates the enrollment number for student users.
 * If the user's role is 'student' and the enrollment number is not provided, it throws an error.
 *
 * @param next - The next middleware function in the request-response cycle.
 * @throws Will throw an error if the user's role is 'student' and the enrollment number is not provided.
 * @returns Returns nothing, but calls the next middleware function if the validation passes.
 */
userSchema.pre('save', function(next) {
    if (this.role === 'student' && !this.enrollmentNumber) {
        return next(new Error('enrollmentNumber is required for students'));
    }
    next();
});



/**
 * This function is used to authenticate an admin user.
 * It connects to the MongoDB database, searches for a user with the provided email or username,
 * and verifies the password. If successful, it returns the user document.
 *
 * @param body - The request body containing the email or username and password.
 * @throws Will throw an error if the user is not found, the password is incorrect, or an internal error occurs.
 * @returns Returns the user document if the authentication is successful.
 */
userSchema.statics.adminLogin = async function(body: AdminLoginRequestBody) {
    await connectToDB();

    try {
        const user = await this.findOne(
            {
                $or: [{ email: body.emailOrUsername }, { username: body.emailOrUsername }],
            }
        )
        if (!user) {
            throw Error ("user not found");
        }
        if (user.password === body.password) {
            return user;
        } else {
            throw Error ("password is incorrect");
        }
    } catch (error) {
        throw Error("internal error")
    
    } finally {
        disConnectfromDB();
    }
}



/**
 * This function is used to authenticate a user.
 * It connects to the MongoDB database, searches for a user with the provided enrollment number or email,
 * and verifies the password. If successful, it returns the user document.
 *
 * @param body - The request body containing the enrollment number or email and password.
 * @throws Will throw an error if the user is not found, the password is incorrect, or an internal error occurs.
 * @returns Returns the user document if the authentication is successful.
 */
userSchema.statics.userLogin = async function(body: LoginRequestBody) {
    await connectToDB();

    try {
        const user = await this.findOne(
            {
                $or: [{ enrollmentNumber: body.enrollmentNumberOrEmail }, { email: body.enrollmentNumberOrEmail }],
            }
        )
        if (!user) {
            throw Error ("user not found");
        }
        if (user.password === body.password) {
            return user;
        } else {
            throw Error ("password is incorrect");
        }
    } catch (error) {
        throw Error("internal error")
    
    } finally {
        disConnectfromDB();
    }
}

const USER: UserModel = mongoose.model<IUser, UserModel>('user', userSchema);

// export default USER;
export default USER