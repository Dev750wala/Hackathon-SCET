import mongoose, { Error as MongooseError } from 'mongoose';

interface ValidationError {
    message: string;
    errors: {
        [key: string]: {
            properties: {
                path: string;
                message: string;
            }
        }
    };
}

interface MongoError {
    code: number;
    keyPattern?: { [key: string]: number };
}

type CustomError = ValidationError | MongoError | Error;


/**
 * This function handles errors that may occur during the process of creating or updating a user in a MongoDB database.
 * It checks for specific error types and constructs an object containing error messages for each field.
 *
 * @param err - The error object to be handled. It can be a ValidationError, MongoError, or a generic Error.
 * @returns An object containing error messages for each field. If no errors are found, an empty object is returned.
 */
export function handleErrors(err: CustomError) {
    
    // TODO continue from here
    if ('message' in err) {
        console.log(err?.message);
    }

    let errors = { enrollmentNumber: '', username: '', email: '', password: '' };

    if ('code' in err && err.code === 11000) {
        if (err.keyPattern?.enrollmentNumber) {
            errors.enrollmentNumber = 'Enrollment number has been already registered';
        } else if (err.keyPattern?.email) {
            errors.email = 'Email has been already registered';
        } else if (err.keyPattern?.username) {
            errors.username = 'This username has been already registered';
        }
    }

    if (err instanceof mongoose.Error.ValidationError) {
        Object.values(err.errors).forEach(({ properties }: any) => {
            const path = properties.path as keyof typeof errors;
            errors[path] = properties.message;
        });
    }

    return errors;
}
