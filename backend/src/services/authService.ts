import { pool } from '../config/db';
import { User, UserCreationData } from '../models/User';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { QueryResult } from 'pg';
import { STRING } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
}

class AuthService {
    private saltRounds = 10; 

    public async registerUser(userData: UserCreationData): Promise<Omit<User, 'password'>> {
        const { username, password } = userData;

        // Check if user already exists
        const existingUserResult: QueryResult<User> = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        if (existingUserResult.rows.length > 0) {
            throw new Error('Username already exists.'); 
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        // Insert new user
        const query = `
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING id, username, created_at; -- Return user data without password
        `;
        try {
            const result: QueryResult<Omit<User, 'password'>> = await pool.query(query, [username, hashedPassword]);
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                throw new Error("User registration failed, no rows returned.");
            }
        } catch (error) {
            console.error("Error registering user:", error);
            throw new Error("Failed to register user in database.");
        }
    }

    public async loginUser(userData: UserCreationData): Promise<{ token: string; user: Omit<User, 'password'> }> {
        const { username, password } = userData;

        // ... (database query and password check) ...
        const query = 'SELECT * FROM users WHERE username = $1;';
        const result: QueryResult<User> = await pool.query(query, [username]);

        if (result.rows.length === 0) {
            throw new Error('Invalid username or password.');
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid username or password.');
        }

        const payload = { userId: user.id, username: user.username };

        // Remove the explicit SignOptions type and cast, use the variable
        
        const token = jwt.sign(payload, JWT_SECRET as string);


        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}

export default AuthService;