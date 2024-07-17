declare namespace NodeJS {
    interface ProcessEnv {
        BASE_URL: string;
        DB_STRING: string;
        BACKEND_PORT: string;
        SESSION_MAX_AGE: string;
        NODEMAILER_EMAIL: string;
        NODEMAILER_PASSWORD: string;
        JWT_STRING: string;
        ADMIN_PASSWORD: string;
    }
}