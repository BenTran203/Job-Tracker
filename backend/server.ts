// filepath: g:\Projects\job-application-tracker\backend\server.ts
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import applicationRoutes from './src/routes/applicationRoutes'; // Import your routes

dotenv.config(); // Load .env variables

const app: Express = express();
const port = process.env.PORT || 5001; // Use port from .env or default

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust for production)
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Basic Route (optional)
app.get('/', (req: Request, res: Response) => {
  res.send('Job Application Tracker API');
});

// API Routes
app.use('/api/applications', applicationRoutes); // Mount application routes under /api/applications

// Simple Error Handling (can be expanded)
app.use((err: Error, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});