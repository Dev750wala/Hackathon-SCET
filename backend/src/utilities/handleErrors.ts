import mongoose, { MongooseError } from 'mongoose';

interface MongoError {
    code: number;
    keyPattern?: {
        enrollmentNumber?: any;
        email?: any;
        username?: any;
    };
    keyValue?: {
        enrollmentNumber?: any;
        email?: any;
        username?: any;
    };
}

interface CustomError extends Error {
    statusCode?: number;
    data?: any;
}

export function handleErrors(err: unknown, role: "organizer" | "student") {
    let errors = { enrollmentNumber: '', username: '', email: '', password: '', general: '', statusCode: 1 };
    // console.log("Error 1!!----------------------------------------------------------------");

    if ( isMongoError(err) && err.code === 11000) {
        // console.log(JSON.stringify(err, null, 2));
        if (JSON.stringify(err).includes("email_1 dup key")) {
            // console.log("Error in duplication!!----------------------------------------------------------------");
            errors.email = 'Email has already been registered';
        }
        if (JSON.stringify(err).includes("enrollmentNumber_1 dup key")) {
            // console.log("Error in duplication!!----------------------------------------------------------------");
            errors.enrollmentNumber = 'Enrollment number has already been registered';
        }
        if (JSON.stringify(err).includes("username_1 dup key")) {
            // console.log("Error in duplication!!----------------------------------------------------------------");
            errors.username = 'Username has already been registered';
        }
        // if (err.keyPattern?.email || err.keyValue?.email) {
        //     console.log("HEllo WORLdd1")
        //     errors.email = 'Email has already been registered';
        // }
        if (role === "student" && (err.keyPattern?.enrollmentNumber || err.keyValue?.enrollmentNumber)) {
            console.log("HEllo WORLdd2")
            errors.enrollmentNumber = 'Enrollment number has already been registered';
        } 
        if (err.keyPattern?.username || err.keyValue?.username) {
            console.log("HEllo WORLdd3")
            errors.username = 'This username has already been registered';
        }

        errors.statusCode = 409; // Conflict status code for duplicate entries
    }
    
    else if (isValidationError(err)) {
        console.log("Error validation error!!----------------------------------------------------------------");
        Object.values(err.errors).forEach(({ properties }: any) => {
            const path = properties.path as keyof typeof errors;
            if (path in errors) {
                errors[path] = properties.message as never;
            }
        });
        errors.statusCode = 400; // Bad Request for validation errors
    }

    else if (isAuthenticationError(err)) {
        errors.general = 'Authentication failed. Please check your credentials.';
        errors.statusCode = 401; // Unauthorized status code
    }

    else if (isAuthorizationError(err)) {
        errors.general = 'You do not have permission to perform this action.';
        errors.statusCode = 403; // Forbidden status code
    }

    else if (isNetworkError(err)) {
        errors.general = 'A network error occurred. Please try again later.';
        errors.statusCode = 503; // Service Unavailable for network errors
    }

    else if (isCustomError(err)) {
        console.log("Error customError!!----------------------------------------------------------------");
        console.log("Error customError!!----------------------------------------------------------------");
        console.log("Error customError!!----------------------------------------------------------------");
        errors.general = err.message || 'An error occurred';
        errors.statusCode = err.statusCode || 500; // Use the custom status code or default to 500
    }

    else if (err instanceof Error) {
        console.log("Error 2!!----------------------------------------------------------------");
        if (err.message === "user not found") {
            errors.general = 'User not found';
            errors.statusCode = 404;
        } else if (err.message === "password is incorrect") {
            errors.password = "Password is incorrect";
            errors.statusCode = 401;
        } else if (err.message === "internal error") {
            errors.general = "Sorry, can't reach out to the server, please try again";
            errors.statusCode = 500;
        } else {
            errors.general = err.message;
        }
    }

    else {
        console.log("An unexpected internal server error occurred.\n\n");
        errors.general = 'An unexpected error occurred. Please try again later.';
        errors.statusCode = 500; // Internal Server Error status code
    }

    return errors;
}

// Type guard for MongoError
function isMongoError(err: any): err is MongoError {
    return typeof err === 'object' && err !== null && 'code' in err && (err.code === 11000);
}

// Type guard for mongoose.ValidationError
function isValidationError(err: any): err is mongoose.Error.ValidationError {
    return err instanceof mongoose.Error.ValidationError;
}

// Type guard for authentication errors
function isAuthenticationError(err: any): err is CustomError {
    return err instanceof Error && err.message === 'Authentication failed';
}

// Type guard for authorization errors
function isAuthorizationError(err: any): err is CustomError {
    return err instanceof Error && err.message === 'Authorization failed';
}

// Type guard for network errors
function isNetworkError(err: any): err is CustomError {
    return err instanceof Error && err.message === 'Network Error';
}

// Type guard for custom application errors
function isCustomError(err: any): err is CustomError {
    return err instanceof Error && 'statusCode' in err;
}

export function handleProjectErrors(err: unknown) {
    let errors = { name: '', description: '',  start: '',  maxParticipants: '', judges: '', prizes: '', rulesAndRegulations: '', theme: '', techTags: '', statusCode: 1, general: '' };

    if (isValidationError(err)) {
        Object.values(err.errors).forEach(({ properties }: any) => {
            const path = properties.path as keyof typeof errors;
            if (path in errors) {
                errors[path] = properties.message as never;
            }
        });
        errors.statusCode = 400; // Bad Request for validation errors
    }

    else if (isCustomError(err)) {
        errors.general = err.message || 'An error occurred';
        errors.statusCode = err.statusCode || 500; // Use the custom status code or default to 500
    }

    else if (err instanceof Error) {
        if (err.message === "internal error") {
            errors.general = "Sorry, can't reach out to the server, please try again";
            errors.statusCode = 500;
        } else {
            errors.general = err.message;
        }
    }

    else {
        errors.general = 'An unexpected error occurred. Please try again later.';
        errors.statusCode = 500; // Internal Server Error status code
    }

    return errors;
}