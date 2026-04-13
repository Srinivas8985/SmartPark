import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api, { calculateDistance } from '../services/api';
import SlotCard from '../components/SlotCard';
import GlassCard from '../components/GlassCard';
import SearchFilter from '../components/SearchFilter';
import MockMap from '../components/MockMap';
import AdminDashboard from '../components/AdminDashboard';
import OwnerAnalytics from '../components/OwnerAnalytics';
import { SkeletonGrid } from '../components/SkeletonCard';
import ChatList from '../components/ChatList';
import ChatBox from '../components/ChatBox';

import './Dashboard.css';

// ── Recommendation Engine (Feature #7) ───────────────────
const getRecommendations = (slots, bookings, userLocation) => {
  if (!slots.length) return [];
  
  const scored = slots.map(slot => {
    let score = 0;
    if (bookings.some(b => b.slotId === slot._id)) score += 30;
    score += (slot.rating || 0) * 8;
    score += (slot.availableSpots / (slot.totalSpots || 1)) * 20;
    score += Math.min(slot.bookingCount || 0, 50) * 0.3;
    if (userLocation && slot.coordinates) {
      const [lon, lat] = slot.coordinates;
      const distStr = calculateDistance(userLocation.lat, userLocation.lon, lat, lon);
      const dist = parseFloat(distStr);
      if (!isNaN(dist)) score += Math.max(0, 20 - dist * 2);
    }
    return { ...slot, score };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 3);
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  if (user?.role === 'ADMIN') return <AdminDashboard />;

  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [view, setView] = useState(searchParams.get('view') || 'browse');
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distances, setDistances] = useState({});
  const [selectedChatUser, setSelectedChatUser] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
          showToast('📍 Location detected — showing distances', 'info');
        },
        () => setUserLocation({ lat: 12.9716, lon: 77.5946 }),
        { timeout: 8000 }
      );
    }
  }, []);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (user.role === 'OWNER') {
        if (view === 'browse') {
          const res = await api.get('/bookings/owner-bookings');
          setBookings(res.data);
        }
      } else {
        if (view === 'browse') {
          const res = await api.get('/slots');
          setSlots(res.data);
          setFilteredSlots(res.data);
          
          if (userLocation) {
            const dists = {};
            res.data.forEach(s => {
              if (s.coordinates) {
                const [lon, lat] = s.coordinates;
                dists[s._id] = calculateDistance(userLocation.lat, userLocation.lon, lat, lon);
              }
            });
            setDistances(dists);
          }

          const myBookings = await api.get('/bookings/my-bookings');
          setRecommendations(getRecommendations(res.data, myBookings.data, userLocation));
        }
      }
    } catch (err) {
      showToast('Failed to load data', 'error');
    }
    setLoading(false);
  }, [user, view, userLocation]);

  useEffect(() => {
    const paramView = searchParams.get('view');
    if (paramView) setView(paramView);
  }, [searchParams]);

  useEffect(() => {
    if (view !== 'messages') fetchData();
  }, [view]);

  useEffect(() => {
    if (userLocation && slots.length) {
      const dists = {};
      slots.forEach(s => {
        if (s.coordinates) {
          const [lon, lat] = s.coordinates;
          dists[s._id] = calculateDistance(userLocation.lat, userLocation.lon, lat, lon);
        }
      });
      setDistances(dists);
    }
  }, [userLocation, slots]);

  const handleFilterChange = ({ search, maxPrice, sortBy }) => {
    let result = [...slots];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.amenities?.some(a => a.toLowerCase().includes(q))
      );
    }
    result = result.filter(s => (s.smartPrice || s.pricePerHour) <= maxPrice);

    if (sortBy === 'price_asc') result.sort((a, b) => (a.smartPrice || a.pricePerHour) - (b.smartPrice || b.pricePerHour));
    else if (sortBy === 'price_desc') result.sort((a, b) => (b.smartPrice || b.pricePerHour) - (a.smartPrice || a.pricePerHour));
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'availability') result.sort((a, b) => b.availableSpots - a.availableSpots);
    else if (sortBy === 'distance' && userLocation) {
      result.sort((a, b) => (parseFloat(distances[a._id]) || 999) - (parseFloat(distances[b._id]) || 999));
    }
    setFilteredSlots(result);
  };

  const TABS = [
    { id: 'browse', label: user?.role === 'OWNER' ? '📋 Activity' : '🔍 Find Parking' },
    { id: 'bookings', label: user?.role === 'OWNER' ? '➕ List Slot' : '🗓 My Bookings' },
    ...(user?.role === 'OWNER' ? [{ id: 'analytics', label: '📊 Analytics' }] : []),
    { id: 'messages', label: '💬 Messages' },
  ];

  return (
    <div className="dashboard-page pt-header">
      {selectedChatUser && (
        <ChatBox
          receiverId={selectedChatUser._id}
          receiverName={selectedChatUser.name}
          onClose={() => setSelectedChatUser(null)}
        />
      )}

      <div className="container">
        {/* Header */}
        <div className="dashboard-header flex justify-between items-end flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black mb-2">Dashboard</h1>
            <p className="text-muted text-sm">
              Welcome back, <span className="font-bold text-primary">{user?.name}</span>
              {' '}·{' '}
              <span className="badge badge-info">{user?.role?.toLowerCase()}</span>
            </p>
          </div>

          <div className="tabs-container glass">
            {TABS.map(tab => (
              <button 
                key={tab.id} 
                className={`tab-btn ${view === tab.id ? 'active' : ''}`} 
                onClick={() => setView(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Views */}
        <div className="view-container animate-fade">
          {view === 'messages' && (
            <div>
              <h2 className="text-xl font-bold mb-4">💬 Conversations</h2>
              <ChatList onSelectUser={setSelectedChatUser} />
            </div>
          )}

          {view === 'analytics' && user?.role === 'OWNER' && (
            <div>
              <h2 className="text-xl font-bold mb-4">📊 Performance Analytics</h2>
              <OwnerAnalytics />
            </div>
          )}

          {user?.role === 'OWNER' && view === 'bookings' && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold mb-2">Add a Parking Slot</h2>
              <p className="text-muted mb-6">Use the dedicated form to list your parking space.</p>
              <Link to="/add-parking" className="btn btn-primary lg-btn">➕ Add Parking Slot</Link>
            </div>
          )}

          {user?.role === 'OWNER' && view === 'browse' && (
            <div>
              <h2 className="text-xl font-bold mb-4">📋 Booking Requests</h2>
              {loading ? (
                <div className="flex justify-center py-8"><div className="spinner" /></div>
              ) : bookings.length === 0 ? (
                <GlassCard className="text-center py-8"><p className="text-muted">No bookings received yet.</p></GlassCard>
              ) : (
                <GlassCard className="p-0">
                  <ul className="booking-list">
                    {bookings.map(b => (
                      <li key={b._id} className="booking-item flex justify-between items-center p-4">
                        <div className="flex items-center gap-4">
                          <div className="avatar">{b.driver?.name?.charAt(0)}</div>
                          <div>
                            <p className="font-bold">{b.driver?.name}</p>
                            <p className="text-xs text-muted">{b.slot?.name} · {new Date(b.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <div className="font-bold text-success">+₹{b.totalAmount}</div>
                            <div className="badge badge-info">{b.status}</div>
                          </div>
                          {b.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <button onClick={() => { api.put(`/bookings/${b._id}`, { status: 'CONFIRMED' }); fetchData(); }} className="btn-sm btn-outline">Approve</button>
                              <button onClick={() => { api.put(`/bookings/${b._id}`, { status: 'REJECTED' }); fetchData(); }} className="btn-sm btn-outline">Reject</button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}
            </div>
          )}

          {user?.role === 'DRIVER' && view === 'browse' && (
            <div>
              {recommendations.length > 0 && !loading && (
                <div className="ai-picks mb-8">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    🧠 Recommended for You <span className="badge badge-info">AI Picks</span>
                  </h2>
                  <div className="grid md-grid-cols-3 gap-6">
                    {recommendations.map(slot => (
                      <SlotCard key={slot._id} slot={slot} />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">🔍 All Parking Spots</h2>
                <button onClick={() => setShowMap(!showMap)} className="btn btn-outline btn-sm">
                  {showMap ? '📋 List View' : '🗺️ Map View'}
                </button>
              </div>

              <SearchFilter onFilterChange={handleFilterChange} />

              <div className="mt-6">
                {loading ? (
                  <SkeletonGrid count={6} />
                ) : showMap ? (
                  <MockMap slots={filteredSlots} userLocation={userLocation} />
                ) : filteredSlots.length === 0 ? (
                  <GlassCard className="text-center py-8"><p className="text-muted">No spots match your search.</p></GlassCard>
                ) : (
                  <div className="grid md-grid-cols-3 gap-6">
                    {filteredSlots.map(slot => (
                      <SlotCard key={slot._id} slot={slot} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {user?.role === 'DRIVER' && view === 'bookings' && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🗓️</div>
              <h2 className="text-2xl font-bold mb-2">Your Bookings</h2>
              <p className="text-muted mb-6">View booking history, invoices and status.</p>
              <Link to="/my-bookings" className="btn btn-primary lg-btn">View All Bookings →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
