import { Router } from 'express';
import ApplicationController from '../controllers/applicationController';

const router = Router();
const applicationController = new ApplicationController();

// Route to get all applications and create a new application
router.route('/')
    .get(applicationController.getApplications.bind(applicationController))
    .post(applicationController.createApplication.bind(applicationController))
    .put(applicationController.updateApplication.bind(applicationController))
    .delete(applicationController.deleteApplication.bind(applicationController));

router.route('/:id')
    .put(applicationController.updateApplication.bind(applicationController))
    .delete(applicationController.deleteApplication.bind(applicationController))
    .get(applicationController.getApplicationById.bind(applicationController)); 

export default router;