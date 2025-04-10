import { Router, Handler } from 'express';
import ApplicationController from '../controllers/applicationController';
import authMiddleware from '../middleware/authMiddleware'; // Import the middleware

const router = Router();
const applicationController = new ApplicationController();

// Apply authMiddleware to all routes in this file
router.use(authMiddleware as Handler);

router.route('/')
    .get(applicationController.getApplications.bind(applicationController))
    .post(applicationController.createApplication.bind(applicationController));

router.route('/:id')
    .get(applicationController.getApplicationById.bind(applicationController)) 
    .put(applicationController.updateApplication.bind(applicationController))   
    .delete(applicationController.deleteApplication.bind(applicationController)); 

export default router;