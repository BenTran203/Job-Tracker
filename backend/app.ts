import express from 'express';
import { json } from 'body-parser';
import applicationRoutes from './routes';
import errorHandler from './middlewares/errorHandler';

const app = express();

// Middleware
app.use(json());

// Routes
app.use('/api', applicationRoutes());

// Error handling middleware
app.use(errorHandler);

export default app;