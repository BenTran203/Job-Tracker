import { Request, Response } from 'express';
import ApplicationService from '../services/applicationService';

class ApplicationController {
    private applicationService: ApplicationService;

    constructor() {
        this.applicationService = new ApplicationService();
    }

    public async createApplication(req: Request, res: Response): Promise<void> {
        try {
            const applicationData = req.body;
            const newApplication = await this.applicationService.createApplication(applicationData);
            res.status(201).json(newApplication);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error creating application';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async getApplications(req: Request, res: Response): Promise<void> {
        try {
            const applications = await this.applicationService.getApplications();
            res.status(200).json(applications);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error fetching applications';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async getApplicationById(req: Request, res: Response): Promise<void> {
        try {
            const applicationId = req.params.id;
            const application = await this.applicationService.getApplicationById(applicationId);

            if (application) {
                res.status(200).json(application);
            } else {
                // If the service returns null, the application was not found
                res.status(404).json({ message: `Application with id ${applicationId} not found.` });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error fetching application by ID';
            // Log the error for debugging on the server
            console.error(`Error in getApplicationById for id ${req.params.id}:`, error);
            res.status(500).json({ message: errorMessage });
        }
    }

    public async updateApplication(req: Request, res: Response): Promise<void> {
        try {
            const applicationId = req.params.id;
            const applicationData = req.body;
            const updatedApplication = await this.applicationService.updateApplication(applicationId, applicationData);
            res.status(200).json(updatedApplication);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error update applications';
            res.status(500).json({ message: errorMessage });
        }
    }

    public async deleteApplication(req: Request, res: Response): Promise<void> {
        try {
            const applicationId = req.params.id;
            await this.applicationService.deleteApplication(applicationId);
            res.status(204).send();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error delete applications';
            res.status(500).json({ message: errorMessage });
        }
    }
}

export default ApplicationController;