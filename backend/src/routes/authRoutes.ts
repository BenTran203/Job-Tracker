import { Router } from 'express';
import AuthController from '../controllers/authController';

const router = Router();
const authController = new AuthController();

// Route for user registration
router.post('/register', authController.register.bind(authController));

// Route for user login
router.post('/login', authController.login.bind(authController));

export default router;