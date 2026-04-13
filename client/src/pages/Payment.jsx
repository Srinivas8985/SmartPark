import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { slot } = location.state || {};

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  if (!slot) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <div className="text-5xl mb-4">❌</div>
        <p className="text-muted mb-4">No booking details found.</p>
        <button onClick={() => navigate('/dashboard')} className="text-primary font-bold">← Go to Dashboard</button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      try {
        await api.post('/bookings', {
          slotId: slot._id,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          totalAmount: slot.pricePerHour, // mock api logic
          hours: 1,
        });
        setPaid(true);
        showToast('💳 Payment successful! Slot booked.', 'success');
      } catch (err) {
        showToast(err?.response?.data?.msg || 'Booking failed. Please retry.', 'error');
        setLoading(false);
      }
    }, 1800);
  };

  if (paid) {
    return (
      <div className="flex items-center justify-center min-h-screen payment-page">
        <div className="text-center animate-bounce-in">
          <div className="text-8xl mb-6">✅</div>
          <h2 className="text-3xl font-black mb-3">Payment Successful!</h2>
          <p className="text-muted mb-8">Your spot at <span className="font-bold text-primary">{slot.name}</span> is reserved.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/my-bookings')} className="btn btn-primary">My Bookings →</button>
            <button onClick={() => navigate('/dashboard')} className="btn btn-outline glass">Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const bill = slot.totalAmount || slot.pricePerHour || 0;
  const grandTotal = Math.round(bill * 1.18);

  return (
    <div className="payment-page pt-header">
      <div className="container payment-container">
        <div className="payment-card overflow-hidden glass animate-fade">
          {/* Summary */}
          <div className="payment-summary">
            <h2 className="text-2xl font-black mb-6">📋 Summary</h2>
            <div className="summary-items">
              <div className="summary-item">
                <p className="label">Parking Spot</p>
                <p className="value">{slot.name}</p>
              </div>
              <div className="summary-item">
                <p className="label">Location</p>
                <p className="value">{slot.address}</p>
              </div>
              <div className="summary-item mt-2 pt-2 border-t border-color-light">
                <p className="label">Total (incl. GST)</p>
                <p className="text-4xl font-black text-accent mt-1">₹{grandTotal}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="payment-form-side bg-surface p-8">
            <h3 className="text-xl font-black mb-6">💳 Payment Details</h3>
            <form onSubmit={handlePayment} className="grid grid-cols-1 gap-4">
              <div className="input-group mb-0">
                <label className="input-label text-xs">Card Holder Name</label>
                <input type="text" required className="input-field" placeholder="John Doe" value={cardName} onChange={e => setCardName(e.target.value)} />
              </div>
              <div className="input-group mb-0">
                <label className="input-label text-xs">Card Number</label>
                <input type="text" required maxLength={19} className="input-field" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="input-group mb-0">
                  <label className="input-label text-xs">Expiry</label>
                  <input type="text" required maxLength={5} className="input-field" placeholder="MM/YY" value={expiry} onChange={e => setExpiry(e.target.value)} />
                </div>
                <div className="input-group mb-0">
                  <label className="input-label text-xs">CVV</label>
                  <input type="password" required maxLength={3} className="input-field" placeholder="123" value={cvv} onChange={e => setCvv(e.target.value)} />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="btn btn-primary mt-4 w-full" style={{ padding: '1.2rem' }}>
                {loading ? <span className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}/> : `Pay ₹${grandTotal}`}
              </button>
              <p className="text-center text-xs text-muted mt-2">🔒 Secured gateway · AES-256 encrypted</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
