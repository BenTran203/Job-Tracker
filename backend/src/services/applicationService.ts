import {pool} from '../config/db'; // Import the configured pool
import { Application, ApplicationCreationData, ApplicationUpdateData } from '../models/Application';
import { QueryResult } from 'pg';

class ApplicationService {

    public async createApplication(applicationData: ApplicationCreationData): Promise<Application> {
        const { company_name, job_title, status, application_date, job_description, notes, url } = applicationData;
        const query = `
            INSERT INTO applications (company_name, job_title, status, application_date, job_description, notes, url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [
            company_name,
            job_title,
            status ?? 'Applied', // Default status if not provided
            application_date ?? new Date(), // Default date if not provided
            job_description,
            notes,
            url
        ];
        try {
            const result: QueryResult<Application> = await pool.query(query, values);
            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                throw new Error("Application creation failed, no rows returned.");
            }
        } catch (error) {
            console.error("Error creating application:", error);
            // Re-throw the error to be caught by the controller
            throw new Error("Failed to create application in database.");
        }
    }

    public async getApplications(): Promise<Application[]> {
        const query = 'SELECT * FROM applications ORDER BY updated_at DESC;'; // Or order by application_date, etc.
        try {
            const result: QueryResult<Application> = await pool.query(query);
            return result.rows;
        } catch (error) {
            console.error("Error fetching applications:", error);
            throw new Error("Failed to retrieve applications from database.");
        }
    }

    public async getApplicationById(id: string): Promise<Application | null> {
        const query = 'SELECT * FROM applications WHERE id = $1;';
        try {
            const result: QueryResult<Application> = await pool.query(query, [id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (error) {
            console.error(`Error fetching application with id ${id}:`, error);
            throw new Error("Failed to retrieve application from database.");
        }
    }


    public async updateApplication(id: string, applicationData: ApplicationUpdateData): Promise<Application | null> {
        const validEntries = Object.entries(applicationData)
            .filter(([, value]) => value !== undefined); // Filter out undefined values
        if (validEntries.length === 0) {
            // If no fields to update, maybe return the existing application or throw an error
             return this.getApplicationById(id);
        }

        const setClause = validEntries
            .map((key, index) => `"${key}" = $${index + 2}`) // Start parameters from $2 ($1 is the id)
            .join(', ');

        const values = validEntries.map(([, value]) => value);
        values.unshift(id); // Add the id as the first parameter ($1)

        const query = `
            UPDATE applications
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *;
        `;

        try {
            const result: QueryResult<Application> = await pool.query(query, values);
             if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error(`Error updating application with id ${id}:`, error);
            throw new Error("Failed to update application in database.");
        }
    }

    public async deleteApplication(id: string): Promise<boolean> {
        const query = 'DELETE FROM applications WHERE id = $1;';
        try {
            const result: QueryResult = await pool.query(query, [id]);
            // Check if any row was actually deleted
            return result.rowCount! > 0;
        } catch (error) {
            console.error(`Error deleting application with id ${id}:`, error);
            throw new Error("Failed to delete application from database.");
        }
    }
}

export default ApplicationService;