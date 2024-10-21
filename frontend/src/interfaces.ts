export interface SignUpFormData {
    enrollmentNumber: string;
    username: string;
    password: string;
    email: string;
    fullName: string;
    contact_no: string;
    biography: string;
    portfolio?: string;
    linkedin?: string;
    github?: string;
    skills: string[];
    api?: string;
}

export interface ParticipationHistory {
    eventName: string;
    date: string;
    awards: string[];
}

export interface SocialLinks {
    linkedin?: string;
    github?: string;
}

// export interface UserDataInStore {
//     enrollmentNumber?: string;
//     username: string;
//     email: string;
//     role: 'student' | 'organizer';
//     fullName: string;
//     profile_pic?: string;
//     contact_no?: string;
//     skills?: string[];
//     biography?: string;
//     portfolio?: string;
//     socialLinks?: SocialLinks;
//     participationHistory?: ParticipationHistory[];
//     availability?: boolean;
//     registrationDate?: Date;
//     verified: boolean;
// }

// export interface SignupResponse {
//     user: User;
//     message: string;
// }

export interface SignUpSuccessResponse {
    user: User;
    message: string;
}

export interface SignupDuplication {
    duplication: Duplication;
}

export interface Duplication {
    email: boolean;
    username: boolean;
    enrollmentNumber: boolean;
}

export interface SignupErrorResponse {
    email: string;
    enrollmentNumber: string;
    username: string;
    password: string;
    general: string;
    statusCode: number;
}

// TODO error might occur
export interface User {
    enrollmentNumber?: string;
    username: string;
    email: string;
    role: "student" | "organizer";
    fullName: string;
    contact_no: string;
    skills: string[];
    biography: string;
    portfolio: string;
    socialLinks: SocialLinks;
    verified: boolean;
    availability: boolean;
    registrationDate: Date;
    participationHistory: any[];
}


export interface VerificationCode {
    createdAt: number;
    code: string;
}

export interface verificationUser {
    user: User;
    isAdmin: boolean;
    message?: string;
}


// ------------------------------------------------------------

export interface ProjectCreationSuccessResponse {
    message: string;
    project: Project;
}

export interface ProjectCreationErrorResponse {
    error: any;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    start: Date;
    organizer: string;
    maxParticipants: number;
    judges: Judge[];
    prizes: string;
    rulesAndRegulations: string;
    theme: string;
    techTags: string[];
    status: string;
    participantTeam: any[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Judge {
    name: string;
    _id: string;
}

export interface ProjectFetchingSuccessResponse {
    id: string;
    name: string;
    description: string;
    registrationStart: Date;
    registrationEnd: Date;
    start: Date;
    end: Date | null;
    organizer: Organizer;
    maxParticipants: number;
    judges: Judge1[];
    prizes: string;
    rulesAndRegulations: string;
    theme: string;
    techTags: string[];
    totalTeams: number;
    status: 'planned' | 'ongoing' | 'completed';
}

export interface Judge1 {
    name: string;
    userDetails: UserDetails | null;
}

export interface UserDetails {
    fullName: string;
    username: string;
}

export interface Organizer {
    username: string;
    fullName: string;
}