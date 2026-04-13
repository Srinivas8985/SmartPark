import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import InvoiceModal from '../components/InvoiceModal';
import './MyBookings.css';

const STATUS_CONFIG = {
  PENDING: { colorClass: 'status-pending', label: 'Pending Approval' },
  CONFIRMED: { colorClass: 'status-confirmed', label: 'Confirmed' },
  COMPLETED: { colorClass: 'status-completed', label: 'Completed' },
  CANCELLED: { colorClass: 'status-cancelled', label: 'Cancelled' },
  REJECTED: { colorClass: 'status-rejected', label: 'Rejected' },
};

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [invoiceBooking, setInvoiceBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data);
    } catch {
      showToast('Failed to load bookings', 'error');
    }
    setLoading(false);
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      showToast('Booking cancelled. Slot is now available.', 'info');
      fetchBookings();
    } catch {
      showToast('Failed to cancel', 'error');
    }
  };

  const formatDateTime = (d) => new Date(d).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const totalSpent = bookings.filter(b => ['COMPLETED', 'CONFIRMED'].includes(b.status)).reduce((a, b) => a + (b.totalAmount || 0), 0);
  const activeCount = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div className="my-bookings-page pt-header">
      {invoiceBooking && (
        <InvoiceModal booking={invoiceBooking} onClose={() => setInvoiceBooking(null)} />
      )}

      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline mb-4">
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-black mb-1">My Bookings</h1>
          <p className="text-muted">Track your parking history, download invoices, and manage reservations.</p>
        </div>

        {/* Stats */}
        <div className="grid md-grid-cols-3 gap-4 mb-8">
          <GlassCard className="text-center p-4">
            <div className="text-2xl mb-1">💳</div>
            <div className="text-xl font-black text-success">₹{totalSpent}</div>
            <div className="text-xs text-muted">Total Spent</div>
          </GlassCard>
          <GlassCard className="text-center p-4">
            <div className="text-2xl mb-1">🗓️</div>
            <div className="text-xl font-black text-info">{activeCount}</div>
            <div className="text-xs text-muted">Active Bookings</div>
          </GlassCard>
          <GlassCard className="text-center p-4">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-xl font-black text-accent">{completedCount}</div>
            <div className="text-xs text-muted">Completed</div>
          </GlassCard>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {['all', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`filter-btn ${filter === s ? 'active' : ''}`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label}
              <span className="count-badge">
                ({s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length})
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <GlassCard className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-bold mb-2">No bookings found</h3>
            <p className="text-muted mb-6">
              {filter === 'all' ? "You haven't made any bookings yet." : `No ${filter.toLowerCase()} bookings.`}
            </p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Find Parking →</button>
          </GlassCard>
        ) : (
          <div className="bookings-list flex flex-col gap-4">
            {filtered.map(b => {
              const sc = STATUS_CONFIG[b.status] || STATUS_CONFIG.PENDING;
              const canCancel = ['PENDING', 'CONFIRMED'].includes(b.status);
              
              return (
                <div key={b._id} className="booking-card card bg-surface animate-fade p-0 overflow-hidden">
                  <div className={`booking-status-bar ${sc.colorClass}`}>
                    <span className="font-bold flex items-center gap-2">
                      <span className="dot" /> {sc.label}
                    </span>
                    <span className="text-muted font-normal">{b.invoiceNumber}</span>
                  </div>

                  <div className="p-5 flex justify-between flex-wrap gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{b.slot?.name}</h3>
                      <p className="text-xs text-muted mb-3">📍 {b.slot?.address}</p>

                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div><span className="text-muted text-xs block">Check-in:</span> <span className="font-semibold">{formatDateTime(b.startTime)}</span></div>
                        <div><span className="text-muted text-xs block">Duration:</span> <span className="font-semibold">{b.hours || 1}h</span></div>
                        <div><span className="text-muted text-xs block">Check-out:</span> <span className="font-semibold">{formatDateTime(b.endTime)}</span></div>
                        <div><span className="text-muted text-xs block">Total:</span> <span className="font-black text-primary">₹{b.totalAmount}</span></div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button onClick={() => setInvoiceBooking(b)} className="btn btn-outline btn-sm">🧾 Invoice</button>
                      {canCancel && (
                        <button onClick={() => handleCancel(b._id)} className="btn btn-sm btn-danger-outline">Cancel</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
