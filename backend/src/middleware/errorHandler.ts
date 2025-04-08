import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean; // Optional: Flag for expected errors vs bugs
}

const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    // Log the error internally (consider using a more robust logger like Winston or Pino)
    console.error('ERROR STACK:', err.stack);
    console.error('ERROR MESSAGE:', err.message);

    // Default error status and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle specific error types if needed (e.g., validation errors, not found errors from service)
    // Example: If your service throws a specific error for "Not Found"
    if (err.message.includes('not found')) { // Simple check, could be more robust
         statusCode = 404;
    }

    // You might want to send less detail in production
    if (process.env.NODE_ENV === 'production' && !err.isOperational) {
        message = 'Something went wrong!';
        statusCode = 500; // Ensure critical internal errors don't leak details
    }

    // Send the JSON response
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
        // Optionally include stack in development
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export default errorHandler;