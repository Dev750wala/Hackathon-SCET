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