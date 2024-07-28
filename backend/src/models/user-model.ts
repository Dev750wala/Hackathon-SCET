import mongoose from "mongoose";
import { IUser } from "../interfaces/user-interfaces";


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


userSchema.pre('save', function(next) {
    if (this.role === 'student' && !this.enrollmentNumber) {
        return next(new Error('enrollmentNumber is required for students'));
    }
    next();
});


const USER = mongoose.model<IUser>('user', userSchema);

export default USER;