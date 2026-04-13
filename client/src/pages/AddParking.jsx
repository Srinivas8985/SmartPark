import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import GlassCard from '../components/GlassCard';

const AddParking = () => {
  const [formData, setFormData] = useState({
    name: '', address: '', totalSpots: '', pricePerHour: '', description: '',
    startTime: '00:00', endTime: '23:59',
    amenities: { cctv: false, covered: false, ev: false, security: false }
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleAmenity = (e) => {
    setFormData({ ...formData, amenities: { ...formData.amenities, [e.target.name]: e.target.checked } });
  };
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const activeAmenities = Object.keys(formData.amenities).filter(k => formData.amenities[k])
      .map(k => k === 'cctv' ? 'CCTV' : k === 'ev' ? 'EV Charging' : k === 'covered' ? 'Covered' : 'Security Guard');

    const mockLat = 12.9716 + (Math.random() - 0.5) * 0.1;
    const mockLon = 77.5946 + (Math.random() - 0.5) * 0.1;

    try {
      await api.post('/slots', {
        ...formData,
        amenities: activeAmenities,
        coordinates: [mockLon, mockLat],
        totalSpots: Number(formData.totalSpots),
        pricePerHour: Number(formData.pricePerHour),
      });
      showToast('Parking slot added successfully! 🎉', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Failed to add slot', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="pt-header pb-12">
      <div className="container" style={{ maxWidth: '42rem' }}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-sm btn-outline mb-6">
          ← Back to Dashboard
        </button>

        <div className="mb-6">
          <h1 className="text-3xl font-black mb-1">List your Parking Space</h1>
          <p className="text-muted">Start earning by sharing your unused space with others.</p>
        </div>

        <GlassCard>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Slot Name <span className="text-danger">*</span></label>
              <input name="name" value={formData.name} onChange={onChange} className="input-field" placeholder="e.g. MG Road VIP Parking" required />
            </div>

            <div className="input-group">
              <label className="input-label">Full Address <span className="text-danger">*</span></label>
              <textarea name="address" value={formData.address} onChange={onChange} className="input-field" rows="2" placeholder="123 Main St, Bengaluru..." required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Total Spots <span className="text-danger">*</span></label>
                <input type="number" name="totalSpots" value={formData.totalSpots} onChange={onChange} min="1" className="input-field" placeholder="Number of cars" required />
              </div>
              <div className="input-group">
                <label className="input-label flex justify-between">
                  <span>Base Price (/hr) <span className="text-danger">*</span></span>
                  <span className="badge badge-info text-xs scale-90">Smart Pricing Ready</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted font-bold">₹</span>
                  <input type="number" name="pricePerHour" value={formData.pricePerHour} onChange={onChange} min="10" className="input-field" style={{ paddingLeft: '2rem' }} placeholder="50" required />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Available From</label>
                <input type="time" name="startTime" value={formData.startTime} onChange={onChange} className="input-field" required />
              </div>
              <div className="input-group">
                <label className="input-label">Available Until</label>
                <input type="time" name="endTime" value={formData.endTime} onChange={onChange} className="input-field" required />
              </div>
            </div>

            <div className="input-group mb-6">
              <label className="input-label mb-2">Features & Amenities</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'cctv', label: '📹 CCTV Auth' },
                  { id: 'covered', label: '⛺ Covered Roof' },
                  { id: 'security', label: '👮 Security Guard' },
                  { id: 'ev', label: '⚡ EV Charging' }
                ].map(am => (
                  <label key={am.id} className={`role-card flex items-center justify-center gap-2 p-3 cursor-pointer border rounded-lg transition ${formData.amenities[am.id] ? 'bg-primary border-primary text-white' : 'border-color bg-surface'}`}>
                    <input type="checkbox" name={am.id} checked={formData.amenities[am.id]} onChange={handleAmenity} className="hidden" />
                    <span className="text-sm font-semibold">{am.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary lg-btn mt-2">
              {loading ? <span className="spinner" style={{ width: '1rem', height: '1rem', borderWidth: '2px' }} /> : 'Publish Listing →'}
            </button>
            <p className="text-center text-xs text-muted">By publishing, you agree to our terms of service and dynamic pricing model.</p>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default AddParking;
