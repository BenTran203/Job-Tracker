// filepath: g:\Projects\job-application-tracker\backend\src\config\db.ts
import { Pool } from 'pg'; // Use import
import dotenv from 'dotenv'; // Use import

dotenv.config();
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: dbPort,
});


export { pool }; // Named export
