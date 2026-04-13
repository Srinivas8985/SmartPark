import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import './BookingPage.css';

const BookingPage = () => {
  const { slotId } = useParams();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [slot, setSlot] = useState(null);
  const [duration, setDuration] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchSlotAndLock = async () => {
      try {
        const lockRes = await api.post(`/slots/${slotId}/lock`);
        setSlot(lockRes.data);
      } catch (err) {
        showToast(err?.response?.data?.msg || 'Slot unavailable', 'error');
        navigate(`/slot/${slotId}`);
      }
      setLoading(false);
    };
    fetchSlotAndLock();

    return () => {
      api.post(`/slots/${slotId}/unlock`).catch(() => {});
    };
  }, [slotId]);

  const handleBook = () => {
    if (!slot) return;
    navigate('/payment', { state: { slot: { ...slot, totalAmount: (slot.smartPrice || slot.pricePerHour) * duration } } });
  };

  if (loading) return <div className="flex justify-center flex-col items-center min-h-screen"><div className="spinner" /></div>;
  if (!slot) return null;

  const price = slot.smartPrice || slot.pricePerHour;
  const total = price * duration;
  const gst = total * 0.18;
  const grandTotal = total + gst;

  return (
    <div className="booking-page pt-header">
      <div className="container max-w-lg">
        <GlassCard className="animate-slide-in">
          <button onClick={() => navigate(`/slot/${slotId}`)} className="text-muted text-sm mb-4 font-semibold hover-primary">
            ← Cancel Booking
          </button>

          <div className="mb-6">
            <h1 className="text-2xl font-black mb-1">Book Your Slot</h1>
            <p className="text-muted">You have 5:00 minutes to complete this booking.</p>
          </div>

          <div className="booking-summary card bg-surface mb-6">
            <h3 className="font-bold text-lg mb-2">{slot.name}</h3>
            <p className="text-muted text-sm mb-4">📍 {slot.address}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-muted">Rate:</span> <span className="font-bold">₹{price}/hr</span></div>
              <div><span className="text-muted">Spots left:</span> <span className="font-bold text-success">{slot.availableSpots}</span></div>
            </div>
          </div>

          <div className="duration-selector mb-6">
            <label className="input-label">Select Duration (Hours)</label>
            <div className="duration-grid grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 6, 8, 12, 24].map(h => (
                <button
                  key={h}
                  onClick={() => setDuration(h)}
                  className={`btn-sm border border-color font-bold transition ${duration === h ? 'bg-primary text-white border-primary' : 'bg-surface hover-bg'}`}
                >
                  {h} hr
                </button>
              ))}
            </div>
          </div>

          <div className="price-breakdown card bg-bg mb-6 text-sm">
            <h4 className="font-bold mb-3">Price Breakdown</h4>
            <div className="flex justify-between mb-2"><span className="text-muted">Base Fare ({duration}h x ₹{price})</span> <span>₹{Math.round(total)}</span></div>
            <div className="flex justify-between mb-2"><span className="text-muted">GST (18%)</span> <span>₹{Math.round(gst)}</span></div>
            <hr className="my-3 border-color" />
            <div className="flex justify-between font-black text-lg"><span className="text-primary">Total to Pay</span> <span>₹{Math.round(grandTotal)}</span></div>
          </div>

          <button onClick={handleBook} disabled={bookingLoading} className="btn btn-primary w-full">
            {bookingLoading ? 'Processing...' : `Proceed to Payment →`}
          </button>
        </GlassCard>
      </div>
    </div>
  );
};

export default BookingPage;
