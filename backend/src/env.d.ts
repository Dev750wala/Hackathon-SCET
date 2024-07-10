declare namespace NodeJS {
    interface ProcessEnv {
        DB_STRING: string;
        BACKEND_PORT: string;
        JWT_STRING: string;
        SESSION_MAX_AGE: string;
        NODEMAILER_EMAIL: string;
        NODEMAILER_PASSWORD: string;
        BASE_URL: string;
    }
}