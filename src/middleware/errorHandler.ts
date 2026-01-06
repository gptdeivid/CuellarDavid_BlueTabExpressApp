import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * Global error handling middleware
 */
export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    console.error('Error:', err.message);

    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            error: err.name,
            message: err.message,
        });
        return;
    }

    res.status(500).json({
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
    });
}
