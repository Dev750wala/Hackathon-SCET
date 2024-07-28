import mongoose from "mongoose";

export interface ParticipationHistory {
    eventName: string;
    date: string;
    awards: string[];
}

export interface SocialLinks {
    linkedin?: string;
    github?: string;
}

export interface VerificationCode {
    code: string;
    createdAt: number;
}

export interface IUser extends mongoose.Document {
    enrollmentNumber?: string;
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

export interface TokenUser {
    name: string;
    role: string;
    username: string;
    email: string;
    enrollmentNumber: string | undefined;
    verified: boolean;
}

export interface LoginRequestBody {
    enrollmentNumberOrEmail: string;
    password: string;
}

export interface SignupDetails {
    enrollmentNumber: string;
    username: string;
    password: string;
    email: string;
    biography: string;
    fullName: string;
    contact_no: string;
    skills: string[];
    portfolio?: string;
    socialLinks?: SocialLinks;
}


