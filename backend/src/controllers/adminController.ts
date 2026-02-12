import { Response } from 'express';
import Worker from '../models/Worker';
import Booking from '../models/Booking';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

/**
 * Get all pending worker verifications
 * GET /api/admin/workers/pending
 */
export const getPendingWorkers = async (req: AuthRequest, res: Response) => {
  try {
    const pendingWorkers = await Worker.find({
      isVerified: false,
      $or: [
        { 'documents.aadhar.url': { $exists: true } },
        { 'documents.policeVerification.url': { $exists: true } }
      ]
    }).populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      count: pendingWorkers.length,
      workers: pendingWorkers
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Verify a worker (approve KYC)
 * PATCH /api/admin/workers/:id/verify
 */
export const verifyWorker = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    const worker = await Worker.findById(id);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    worker.isVerified = isVerified;
    await worker.save();

    res.status(200).json({
      success: true,
      message: `Worker ${isVerified ? 'verified' : 'rejected'} successfully`,
      worker
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all active (online) workers
 * GET /api/admin/workers/active
 */
export const getActiveWorkers = async (req: AuthRequest, res: Response) => {
  try {
    const activeWorkers = await Worker.find({
      isOnline: true,
      isVerified: true
    }).populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      count: activeWorkers.length,
      workers: activeWorkers
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all workers
 * GET /api/admin/workers
 */
export const getAllWorkers = async (req: AuthRequest, res: Response) => {
  try {
    const { isVerified, isOnline, profession } = req.query;

    const query: any = {};

    if (isVerified !== undefined) {
      query.isVerified = isVerified === 'true';
    }

    if (isOnline !== undefined) {
      query.isOnline = isOnline === 'true';
    }

    if (profession) {
      query.profession = profession;
    }

    const workers = await Worker.find(query).populate('userId', 'name email phone');

    res.status(200).json({
      success: true,
      count: workers.length,
      workers
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get platform analytics
 * GET /api/admin/analytics
 */
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Total workers
    const totalWorkers = await Worker.countDocuments();
    
    // Verified workers
    const verifiedWorkers = await Worker.countDocuments({ isVerified: true });
    
    // Online workers
    const onlineWorkers = await Worker.countDocuments({ isOnline: true });
    
    // Total bookings
    const totalBookings = await Booking.countDocuments();
    
    // Completed bookings
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    
    // Pending bookings
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    
    // Active bookings (accepted or started)
    const activeBookings = await Booking.countDocuments({
      status: { $in: ['accepted', 'started'] }
    });
    
    // Total revenue (sum of all completed bookings)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$pricing' } } }
    ]);
    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;
    
    // Worker distribution by profession
    const workerDistribution = await Worker.aggregate([
      { $group: { _id: '$profession', count: { $sum: 1 } } }
    ]);
    
    // Recent bookings
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .populate({
        path: 'worker',
        populate: {
          path: 'userId',
          select: 'name'
        }
      });

    res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers
        },
        workers: {
          total: totalWorkers,
          verified: verifiedWorkers,
          online: onlineWorkers,
          distribution: workerDistribution
        },
        bookings: {
          total: totalBookings,
          completed: completedBookings,
          pending: pendingBookings,
          active: activeBookings
        },
        revenue: {
          total: totalRevenue,
          formatted: `₹${totalRevenue.toLocaleString('en-IN')}`
        },
        recentBookings
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all bookings
 * GET /api/admin/bookings
 */
export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { status, profession } = req.query;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (profession) {
      query.profession = profession;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate({
        path: 'worker',
        populate: {
          path: 'userId',
          select: 'name phone'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
