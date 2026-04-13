import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import GlassCard from '../components/GlassCard';
import MockMap from '../components/MockMap';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import { SkeletonCard } from '../components/SkeletonCard';

const SlotDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSlot = async () => {
    try {
      const res = await api.get(`/slots/${id}`);
      setSlot(res.data);
    } catch {
      showToast('Slot not found', 'error');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSlot();
    const interval = setInterval(fetchSlot, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="pt-header min-h-screen container max-w-4xl">
        <button className="btn btn-sm btn-outline mb-6" onClick={() => navigate('/dashboard')}>← Back</button>
        <SkeletonCard />
      </div>
    );
  }

  if (!slot) return null;

  const isLocked = slot.locked && slot.lockExpiry && Date.now() < slot.lockExpiry;
  const isFull = slot.availableSpots === 0;

  return (
    <div className="pt-header pb-12 min-h-screen">
      <div className="container max-w-4xl mx-auto flex flex-col gap-8">
        <div>
          <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline mb-6">
            ← Back to Search
          </button>
        </div>

        {/* Top Details */}
        <div className="grid md-grid-cols-2 gap-8 items-start">
          <GlassCard className="animate-slide-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-black mb-2">{slot.name}</h1>
                <p className="text-muted flex items-center gap-2">📍 {slot.address}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted">Base Rate</div>
                <div className="text-3xl font-black text-primary">₹{slot.smartPrice || slot.pricePerHour}<span className="text-sm text-muted">/hr</span></div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`badge ${isFull ? 'badge-danger' : 'badge-success'}`}>
                {isFull ? 'Fully Booked' : `${slot.availableSpots} Spots Available`}
              </span>
              <span className="badge badge-warning">⭐ {(slot.rating || 0).toFixed(1)} Rating</span>
              {slot.smartPrice > slot.pricePerHour && <span className="badge badge-warning text-xs">⚡ High Demand Surge</span>}
            </div>

            <p className="text-muted leading-relaxed mb-6">{slot.description || 'A premium parking space verified by ParkSmart.'}</p>

            <div className="mb-6">
              <h3 className="font-bold mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {slot.amenities?.length ? slot.amenities.map(am => (
                  <span key={am} className="badge bg-surface border border-color text-main">{am}</span>
                )) : <span className="text-sm text-muted">Standard Parking</span>}
              </div>
            </div>

            {/* Lock Status */}
            {isLocked && (
              <div className="p-4 rounded-xl bg-warning-bg text-warning font-semibold border border-warning/20 mb-6 flex gap-3 text-sm items-center">
                <span className="text-xl">🔒</span> This slot is currently locked by another user who is completing payment. Check back in a few minutes.
              </div>
            )}

            {user?.role === 'DRIVER' && (
              <button
                onClick={() => navigate(`/book/${slot._id}`)}
                disabled={isLocked || isFull}
                className={`btn w-full lg-btn shadow-md ${isLocked || isFull ? 'btn-outline' : 'btn-primary shadow-neon'}`}
              >
                {isLocked ? 'Temporarily Unavailable' : isFull ? 'No Spots Left' : 'Book Now →'}
              </button>
            )}
          </GlassCard>

          <div className="h-full flex flex-col gap-4 animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-bold text-lg">Location Map</h3>
            <div className="flex-1 min-h-[300px] border border-color rounded-2xl overflow-hidden relative">
              <MockMap slots={[slot]} selectedSlot={slot} />
              <div className="absolute inset-0 z-20 pointer-events-none rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
            </div>
            <div className="text-xs text-center text-muted">Interactive map approximation</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid md-grid-cols-2 gap-8 items-start mt-8 pt-8 border-t border-color">
          <div>
            <h2 className="text-2xl font-bold mb-6">User Reviews</h2>
            <ReviewList slotId={id} refreshTrigger={slot.rating} />
          </div>
          {user?.role === 'DRIVER' && (
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Write a Review</h2>
              <ReviewForm slotId={id} onReviewAdded={fetchSlot} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotDetails;
