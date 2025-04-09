// filepath: g:\Projects\job-application-tracker\backend\src\models\User.ts
export interface User {
    id?: number;
    username: string;
    password: string; // This will store the hashed password
    created_at?: Date;
}

// Type for data needed to create a user (excluding generated fields)
export type UserCreationData = Omit<User, 'id' | 'created_at'>;