import express from 'express';
import {
  submitWorkerApplication,
  getPendingApplications,
  approveWorkerApplication,
  rejectWorkerApplication,
  checkApplicationStatus
} from '../controllers/workerApplicationController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';

const router = express.Router();

// Public routes
router.post('/submit', submitWorkerApplication);
router.post('/check-status', checkApplicationStatus);

// Admin routes
router.get('/pending', protect, isAdmin, getPendingApplications);
router.post('/:id/approve', protect, isAdmin, approveWorkerApplication);
router.post('/:id/reject', protect, isAdmin, rejectWorkerApplication);

export default router;
