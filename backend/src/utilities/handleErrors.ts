import mongoose from 'mongoose';

interface MongoError {
    code: number;
    keyPattern?: {
        enrollmentNumber?: any;
        email?: any;
        username?: any;
    };
}

interface CustomError extends Error {
    statusCode?: number;
    data?: any;
}


/**
 * A function to handle various types of errors and return appropriate error messages.
 *
 * @param err - The error object to be handled.
 * @returns An object containing error messages for different fields.
 *
 * @remarks
 * This function handles errors related to MongoDB unique constraints, mongoose validation errors,
 * authentication errors, authorization errors, network errors, and custom application errors.
 * It logs the error message if it is an instance of Error and returns a generic error message for
 * unexpected internal server errors.
 *
 * @example
 * ```typescript
 * try {
 *     // Code that may throw an error
 * } catch (err) {
 *     const errors = handleErrors(err);
 *     console.log(errors);
 * }
 * ```
 */
export function handleErrors(err: unknown, role: "organizer" | "student") {
    let errors = { enrollmentNumber: '', username: '', email: '', password: '', general: '' };

    // Log the error message if it is an instance of Error
    if (err instanceof Error) {
        console.log(err.message);
    }

    // Handle unique constraint errors for enrollmentNumber, email, and username fields.
    if (isMongoError(err) && err.code === 11000) {
        if (err.keyPattern?.email) {
            errors.email = 'Email has been already registered';
        } else if (role === "student" && err.keyPattern?.enrollmentNumber) {
            errors.enrollmentNumber = 'Enrollment number has been already registered';
        } else if (err.keyPattern?.username) {
            errors.username = 'This username has been already registered';
        }
    }

    // Handle mongoose validation errors
    if (isValidationError(err)) {
        Object.values(err.errors).forEach(({ properties }: any) => {
            const path = properties.path as keyof typeof errors;
            errors[path] = properties.message;
        });
    }

    // if(isDBConnectionError(err)) {
    //     errors.general = 'Database connection error.';
    // }

    // Handle authentication errors
    if (isAuthenticationError(err)) {
        errors.general = 'Authentication failed. Please check your credentials.';
    }

    // Handle authorization errors
    if (isAuthorizationError(err)) {
        errors.general = 'You do not have permission to perform this action.';
    }

    // Handle network errors
    if (isNetworkError(err)) {
        errors.general = 'A network error occurred. Please try again later.';
    }

    // Handle custom application errors
    if (isCustomError(err)) {
        if (err.statusCode === 500) {
            errors.general = 'An internal server error occurred. Please try again later.';
        } else {
            errors.general = err.message;
        }
    }

    // Generic error handling for unexpected internal server errors
    if (!isMongoError(err) && !isValidationError(err) && !isAuthenticationError(err) && !isAuthorizationError(err) && !isNetworkError(err) && !isCustomError(err)) {
        console.log("An unexpected internal server error occurred.\n\n");
        errors.general = 'An unexpected error occurred. Please try again later.';
    }

    return errors;
}

// function isDBConnectionError

// Type guard for MongoError
function isMongoError(err: any): err is MongoError {
    return typeof err === 'object' && err !== null && 'code' in err;
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
