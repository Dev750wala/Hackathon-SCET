import { IUser, SocialLinks } from "./user-interfaces";

export interface AdminPayload {
    isAdmin: boolean;
}

export interface AdminSignupDetails {
    username: string;
    email: string;
    password: string;
    fullName: string;
    contact_no: string;
    skills: string[];
    biography: string;
    socialLinks?: SocialLinks;
}

export interface AdminTokenUser {
    name: string;
    role: string;
    username: string;
    email: string;
}

export interface AdminLoginRequestBody {
    emailOrUsername: string;
    password: string;
}

export interface AdminUpdateProfileRequest {
    username : string;
    fullName : string;
    contact_no : string;
    skills : string[];
    biography : string;
    socialLinks?: SocialLinks;
}