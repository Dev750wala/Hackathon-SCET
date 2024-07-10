import mongoose, { NumberExpression } from "mongoose";

interface ParticipationHistory {
    eventName: string;
    date: string;
    awards: string[];
}

interface SocialLinks {
    linkedin?: string;
    github?: string;
}

interface VerificationCode {
    code: string;
    createdAt: number;
}

export interface IUser extends mongoose.Document {
    enrollmentNumber: string;
    username: string;
    password: string;
    email: string;
    role: 'student' | 'organizer';
    fullName: string;
    profile_pic?: string;
    contact_no?: string;
    skills?: string[];
    biography?: string;
    portfolio?: string;
    socialLinks?: SocialLinks;
    participationHistory?: ParticipationHistory[];
    availability?: boolean;
    registrationDate?: Date;
    verified: boolean;
    verificationCode: VerificationCode;
}

const userSchema = new mongoose.Schema<IUser>({
        enrollmentNumber: {
            type: String,
            unique: true,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            minlength: 6,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        role: {
            type: String,
            required: true,
            // af
            enum: ['student', 'organizer',],
            // default: 'participant',
        },
        fullName: {
            type: String,
            required: true,
        },
        profile_pic: {
            // BHAI aama dhyan rakhje, buffer pn aavi sake
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
            required: true,
        }
    }, { timestamps: true },
);

const USER = mongoose.model<IUser>('user', userSchema);

export default USER;