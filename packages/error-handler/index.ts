export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details?: any;

    constructor( message: string, statusCode: number, isOperational: true, details?: any){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

//Not Found Error
export class NotFoundError extends AppError{
    constructor(message = "Resources Not Found") {
        super(message, 404, true);
    }
}

//validation errors (use for joi/zod/react-hook-form validation errors)
export class ValidationError extends AppError {
    constructor( message = "Invalid Request Data", details?:any) {
        super(message, 400, true, details);
    }
}

//Authentication Error
export class AuthError extends AppError {
    constructor( message = "Unauthorized") {
        super(message, 401, true);
    }
}

//Database Error
export class DatabaseError extends AppError {
    constructor( message = "Database Error", details?: any) {
        super(message, 500, true, details);
    }
}

//Rate Limiting Error
export class RateLimitError extends AppError {
    constructor( message = "Too many requests, please try again later") {
        super(message, 429, true);
    }
}


// Re-export middleware so consumers can import from the package root
export { errorMiddleware } from './error-handler';