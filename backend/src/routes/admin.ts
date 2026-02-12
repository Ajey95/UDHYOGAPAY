import express from 'express';
import {
  getPendingWorkers,
  verifyWorker,
  getActiveWorkers,
  getAllWorkers,
  getAnalytics,
  getAllBookings
} from '../controllers/adminController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/roleCheck';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(isAdmin);

router.get('/workers/pending', getPendingWorkers);
router.patch('/workers/:id/verify', verifyWorker);
router.get('/workers/active', getActiveWorkers);
router.get('/workers', getAllWorkers);
router.get('/analytics', getAnalytics);
router.get('/bookings', getAllBookings);

export default router;
