import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; 
import applicationRoutes from './src/routes/applicationRoutes'; 
import authRoutes from './src/routes/authRoutes'; 
import errorHandler from './src/middleware/ErrorHandler';

dotenv.config(); 

const app: Express = express();
const port = process.env.PORT || 5001; 

// Middleware
app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Basic Route (optional)
app.get('/', (req: Request, res: Response) => {
  res.send('Job Application Tracker API');
});

// API Routes
app.use('/api/auth', authRoutes); 
app.use('/api/applications', applicationRoutes); 

app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});