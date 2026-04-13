import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const MockMap = ({ slots, userLocation, selectedSlot }) => {
  const navigate = useNavigate();

  // Bounding box for Bangalore roughly
  const minLat = 12.85, maxLat = 13.10;
  const minLon = 77.45, maxLon = 77.75;

  const toXY = (lat, lon) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x, y };
  };

  const markers = useMemo(() => {
    if (!slots || !slots.length) return [];
    return slots.filter(s => s.coordinates).map(s => {
      const [lon, lat] = s.coordinates;
      const { x, y } = toXY(lat, lon);
      return { ...s, x, y };
    });
  }, [slots]);

  let uiLoc = null;
  if (userLocation) {
    uiLoc = toXY(userLocation.lat, userLocation.lon);
  }

  return (
    <div className="card glass relative animate-fade" style={{ height: '400px', width: '100%', overflow: 'hidden', padding: 0 }}>
      {/* Background purely aesthetic pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary/20"></div>
      <div className="absolute inset-y-0 left-1/2 w-0.5 bg-primary/20"></div>

      {userLocation && uiLoc && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse-glow"
          style={{ left: `${uiLoc.x}%`, top: `${uiLoc.y}%`, zIndex: 10 }}
        >
          <div className="w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
          <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary bg-white px-2 py-0.5 rounded shadow whitespace-nowrap">
            You are here
          </div>
        </div>
      )}

      {markers.map(s => {
        const isSelected = selectedSlot?._id === s._id;
        const isFull = s.availableSpots === 0;
        const isLocked = s.locked && s.lockExpiry && Date.now() < s.lockExpiry;

        let colorObj = isFull ? 'bg-danger border-danger' : isLocked ? 'bg-warning border-warning' : 'bg-success border-success';
        
        return (
          <div
            key={s._id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-110"
            style={{ left: `${s.x}%`, top: `${s.y}%`, zIndex: isSelected ? 20 : 5 }}
            onClick={() => navigate(`/slot/${s._id}`)}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-white shadow-md ${colorObj} ${isSelected ? 'animate-bounce-in shadow-neon' : ''}`}>
              🅿️
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MockMap;
