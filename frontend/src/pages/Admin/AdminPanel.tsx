import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Worker } from '../../types/worker';
import { Navbar } from '../../components/common/Navbar';
import { LeafletMap } from '../../components/map/LeafletMap';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';
import { Alert } from '../../components/common/Alert';
import { getPendingApplications, approveApplication, rejectApplication } from '../../services/workerApplicationService';

interface WorkerApplication {
  _id: string;
  name: string;
  personalEmail: string;
  phone: string;
  profession: string;
  experience: number;
  address: string;
  documents?: {
    aadhar?: { url: string; uploadedAt: Date };
    policeVerification?: { url: string; uploadedAt: Date };
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

interface Analytics {
  users: { total: number };
  workers: {
    total: number;
    verified: number;
    online: number;
    distribution: Array<{ _id: string; count: number }>;
  };
  bookings: {
    total: number;
    completed: number;
    pending: number;
    active: number;
  };
  revenue: {
    total: number;
    formatted: string;
  };
}

interface Booking {
  _id: string;
  user: { _id: string; name: string; email: string; phone: string };
  worker: { _id: string; userId: { name: string; phone: string }; profession: string };
  profession: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  otp?: string;
  location: { type: string; coordinates: [number, number] };
  createdAt: Date;
  completedAt?: Date;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'pending' | 'bookings' | 'live'>('analytics');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [pendingApplications, setPendingApplications] = useState<WorkerApplication[]>([]);
  const [activeWorkers, setActiveWorkers] = useState<Worker[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingFilter, setBookingFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [approvalModal, setApprovalModal] = useState<{ show: boolean; application: WorkerApplication | null }>({ show: false, application: null });
  const [workEmail, setWorkEmail] = useState('');
  const [approving, setApproving] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'pending') {
      fetchPendingApplications();
    } else if (activeTab === 'bookings') {
      fetchBookings();
    } else if (activeTab === 'live') {
      fetchActiveWorkers();
    }
  }, [activeTab, bookingFilter]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.analytics);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApplications = async () => {
    setLoading(true);
    try {
      const data = await getPendingApplications();
      setPendingApplications(data.applications);
    } catch (err) {
      console.error('Failed to fetch pending applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveWorkers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/workers/active');
      setActiveWorkers(response.data.workers);
    } catch (err) {
      console.error('Failed to fetch active workers:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = bookingFilter !== 'all' ? { status: bookingFilter } : {};
      const response = await api.get('/admin/bookings', { params });
      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClick = (application: WorkerApplication) => {
    // Generate work email suggestion
    const emailPrefix = application.name.toLowerCase().replace(/\s+/g, '');
    setWorkEmail(`${emailPrefix}@udhyogapay.com`);
    setApprovalModal({ show: true, application });
  };

  const handleApproveSubmit = async () => {
    if (!approvalModal.application || !workEmail) return;

    setApproving(true);
    try {
      const result = await approveApplication(approvalModal.application._id, { workEmail });
      
      if (result.emailSent) {
        setAlert({
          type: 'success',
          message: `✅ Worker approved! Login credentials sent to ${approvalModal.application.personalEmail}`
        });
      } else if (result.credentials) {
        setAlert({
          type: 'success',
          message: `⚠️ Worker approved but email failed. Credentials: ${result.credentials.workEmail} / ${result.credentials.password}. Please send manually to ${result.credentials.personalEmail}`
        });
      } else {
        setAlert({
          type: 'success',
          message: `✅ Worker approved! ${result.message}`
        });
      }
      
      setApprovalModal({ show: false, application: null });
      setWorkEmail('');
      fetchPendingApplications();
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to approve worker'
      });
    } finally {
      setApproving(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;

    try {
      await rejectApplication(applicationId, reason);
      setAlert({
        type: 'success',
        message: 'Application rejected successfully'
      });
      fetchPendingApplications();
    } catch (err: any) {
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to reject application'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Header */}
      <div className="bg-white shadow-sm pt-16">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-6 font-semibold border-b-2 transition ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Analytics
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-6 font-semibold border-b-2 transition ${
                activeTab === 'pending'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              ⏳ Pending Verifications
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-6 font-semibold border-b-2 transition ${
                activeTab === 'bookings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 All Bookings
            </button>
            <button
              onClick={() => setActiveTab('live')}
              className={`py-4 px-6 font-semibold border-b-2 transition ${
                activeTab === 'live'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🗺️ Live Map
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {alert && (
          <div className="mb-4">
            <Alert 
              type={alert.type} 
              message={alert.message} 
              onClose={() => setAlert(null)} 
            />
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : (
          <>
            {/* Analytics Tab */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-gray-600 mb-2">Total Users</p>
                    <p className="text-4xl font-bold text-blue-600">{analytics.users.total}</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-gray-600 mb-2">Total Workers</p>
                    <p className="text-4xl font-bold text-green-600">{analytics.workers.total}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {analytics.workers.verified} verified, {analytics.workers.online} online
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-gray-600 mb-2">Total Bookings</p>
                    <p className="text-4xl font-bold text-purple-600">{analytics.bookings.total}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {analytics.bookings.completed} completed
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <p className="text-gray-600 mb-2">Total Revenue</p>
                    <p className="text-4xl font-bold text-orange-600">{analytics.revenue.formatted}</p>
                  </div>
                </div>

                {/* Worker Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Worker Distribution by Profession</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {analytics.workers.distribution.map((item) => (
                      <div key={item._id} className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{item.count}</p>
                        <p className="text-sm text-gray-600 capitalize">{item._id}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Verifications Tab */}
            {activeTab === 'pending' && (
              <div>
                {/* Approval Modal */}
                {approvalModal.show && approvalModal.application && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                      <h3 className="text-2xl font-bold mb-4">Approve Worker</h3>
                      <div className="mb-6">
                        <p className="text-gray-700 mb-2">
                          <strong>Name:</strong> {approvalModal.application.name}
                        </p>
                        <p className="text-gray-700 mb-2">
                          <strong>Personal Email:</strong> {approvalModal.application.personalEmail}
                        </p>
                        <p className="text-gray-700 mb-4">
                          <strong>Profession:</strong> {approvalModal.application.profession}
                        </p>
                        
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          value={workEmail}
                          onChange={(e) => setWorkEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="worker1@udhyogapay.com"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          A random password will be generated and sent to the worker's personal email
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={handleApproveSubmit}
                          disabled={approving || !workEmail}
                          className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {approving ? 'Approving...' : 'Approve & Send Credentials'}
                        </button>
                        <button
                          onClick={() => {
                            setApprovalModal({ show: false, application: null });
                            setWorkEmail('');
                          }}
                          className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingApplications.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <p className="text-gray-600 text-lg">No pending applications</p>
                    </div>
                  ) : (
                    pendingApplications
                      .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                      .map((application) => (
                        <div key={application._id} className="bg-white p-6 rounded-xl shadow-lg">
                          <div className="mb-4">
                            <h3 className="text-xl font-bold">{application.name}</h3>
                            <p className="text-gray-600 capitalize">{application.profession}</p>
                            <p className="text-sm text-gray-500">{application.experience} years experience</p>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div>
                              <p className="text-xs text-gray-500">Personal Email</p>
                              <p className="text-sm text-gray-700">{application.personalEmail}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <p className="text-sm text-gray-700">{application.phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Address</p>
                              <p className="text-sm text-gray-700">{application.address}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Submitted</p>
                              <p className="text-sm text-gray-700">
                                {new Date(application.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApproveClick(application)}
                              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectApplication(application._id)}
                              className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {/* Pagination */}
                {pendingApplications.length > itemsPerPage && (
                  <div className="mt-6 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(pendingApplications.length / itemsPerPage)}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="mb-6 flex gap-4">
                  <select
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="flex-1"></div>
                  <div className="text-lg font-semibold text-gray-700">
                    Total: <span className="text-blue-600">{bookings.length}</span> bookings
                  </div>
                </div>

                {bookings.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-gray-600 text-lg">No bookings found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                      <div key={booking._id} className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-300 transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            booking.status === 'accepted' ? 'bg-purple-100 text-purple-700' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-semibold mb-1">👤 Customer</p>
                            <p className="text-sm font-bold text-gray-900">{booking.user?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-600">{booking.user?.phone || 'N/A'}</p>
                          </div>

                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-semibold mb-1">🛠️ Worker</p>
                            <p className="text-sm font-bold text-gray-900">{booking.worker?.userId?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-600 capitalize">{booking.profession}</p>
                          </div>

                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 font-semibold mb-1">📍 Location</p>
                            <p className="text-xs text-gray-700">
                              {booking.location?.coordinates?.[1]?.toFixed(4)}, {booking.location?.coordinates?.[0]?.toFixed(4)}
                            </p>
                          </div>

                          {booking.otp && (
                            <div className="bg-orange-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600 font-semibold mb-1">🔐 OTP</p>
                              <p className="text-lg font-bold text-orange-600">{booking.otp}</p>
                            </div>
                          )}

                          {booking.completedAt && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-600 font-semibold mb-1">✅ Completed</p>
                              <p className="text-xs text-gray-700">
                                {new Date(booking.completedAt).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-500">
                            Booking ID: <span className="font-mono">{booking._id.slice(-8)}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Live Map Tab */}
            {activeTab === 'live' && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 bg-blue-600 text-white">
                  <h3 className="text-xl font-bold">
                    Live Workers: {activeWorkers.length}
                  </h3>
                </div>
                <div style={{ height: '600px' }}>
                  <LeafletMap
                    center={[20.5937, 78.9629]} // India center
                    zoom={5}
                    workers={activeWorkers}
                    height="600px"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
