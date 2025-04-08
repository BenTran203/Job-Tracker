import { Router } from 'express';
import ApplicationController from '../controllers/applicationController';

const router = Router();
const applicationController = new ApplicationController();

router.route('/')
    .get(applicationController.getApplications.bind(applicationController))
    .post(applicationController.createApplication.bind(applicationController));

router.route('/:id')
    .get(applicationController.getApplicationById.bind(applicationController)) 
    .put(applicationController.updateApplication.bind(applicationController))   
    .delete(applicationController.deleteApplication.bind(applicationController)); 

export default router;