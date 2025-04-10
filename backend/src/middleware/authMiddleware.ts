import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Extend Express Request type to include user payload
declare global {
    namespace Express {
        interface Request {
            user?: { 
                userId: number; 
                username: string 
            }; 
        }
    }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided or invalid format.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from the header

    if (!JWT_SECRET) {
         console.error("FATAL ERROR: JWT_SECRET is not defined.");
         return res.status(500).json({ message: 'Internal server error: JWT configuration missing.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; username: string; iat: number; exp: number }; // Adjust payload type as needed

        req.user = { userId: decoded.userId, username: decoded.username };
        next(); 
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Unauthorized: Token expired.' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
             return res.status(401).json({ message: 'Unauthorized: Invalid token.' });
        }
        // Handle other potential errors during verification
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: 'Internal server error during token verification.' });
    }
};

export default authMiddleware;