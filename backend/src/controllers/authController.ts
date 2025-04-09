import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';

class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
            // Add input validation here (e.g., using express-validator)
            if (!userData.username || !userData.password) {
                 res.status(400).json({ message: 'Username and password are required.' });
                 return;
            }
            const newUser = await this.authService.registerUser(userData);
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            // Handle specific errors like 'Username already exists'
            if (error instanceof Error && error.message === 'Username already exists.') {
                res.status(409).json({ message: error.message }); // 409 Conflict
            } else {
                next(error); // Pass other errors to the global handler
            }
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
             // Add input validation here
            if (!userData.username || !userData.password) {
                 res.status(400).json({ message: 'Username and password are required.' });
                 return;
            }
            const { token, user } = await this.authService.loginUser(userData);
            res.status(200).json({ message: 'Login successful', token, user });
        } catch (error) {
             // Handle specific errors like 'Invalid username or password'
            if (error instanceof Error && error.message === 'Invalid username or password.') {
                res.status(401).json({ message: error.message }); // 401 Unauthorized
            } else {
                next(error); // Pass other errors to the global handler
            }
        }
    }
}

export default AuthController;