// filepath: g:\Projects\job-application-tracker\backend\src\controllers\applicationController.ts
import { Request, Response, NextFunction } from 'express'; // Add NextFunction
import ApplicationService from '../services/applicationService';

class ApplicationController {
    private applicationService: ApplicationService;

    constructor() {
        this.applicationService = new ApplicationService();
    }

    public async createApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const applicationData = req.body;
            const newApplication = await this.applicationService.createApplication(applicationData);
            res.status(201).json(newApplication);
        } catch (error) {
            next(error);
        }
    }

    public async getApplications(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const applications = await this.applicationService.getApplications();
            res.status(200).json(applications);
        } catch (error) {
            next(error);
        }
    }

    public async getApplicationById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const applicationId = req.params.id;
            const application = await this.applicationService.getApplicationById(applicationId);

            if (application) {
                res.status(200).json(application);
            } else {
                const notFoundError = new Error(`Application with id ${applicationId} not found.`);
                (notFoundError as any).statusCode = 404; 
                next(notFoundError); 
            }
        } catch (error) {
            next(error);
        }
    }

    public async updateApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const applicationId = req.params.id;
            const applicationData = req.body;
            const updatedApplication = await this.applicationService.updateApplication(applicationId, applicationData);

            if (updatedApplication) {
                 res.status(200).json(updatedApplication);
            } else {
                const notFoundError = new Error(`Application with id ${applicationId} not found for update.`);
                (notFoundError as any).statusCode = 404;
                next(notFoundError);
            }
        } catch (error) {
             (error as Error).message = `Error updating application: ${(error as Error).message}`;
            next(error);
        }
    }

    public async deleteApplication(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const applicationId = req.params.id;
            const deleted = await this.applicationService.deleteApplication(applicationId);
            if (deleted) {
                res.status(204).send(); // No content on successful delete
            } else {
                 // Handle case where delete returns false (not found)
                const notFoundError = new Error(`Application with id ${applicationId} not found for deletion.`);
                (notFoundError as any).statusCode = 404;
                next(notFoundError);
            }
        } catch (error) {
             (error as Error).message = `Error deleting application: ${(error as Error).message}`;
            next(error);
        }
    }
}

export default ApplicationController;