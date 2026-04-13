import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// Fix for default marker icons not showing in React Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ slots }) => {
    const navigate = useNavigate();
    const defaultPosition = [17.3850, 78.4867]; // Hyderabad (or default city)

    return (
        <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-soft border border-white/20">
            <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {slots.map(slot => {
                    if (slot.location && slot.location.coordinates) {
                        // GeoJSON is [lng, lat], Leaflet is [lat, lng]
                        const [lng, lat] = slot.location.coordinates;
                        if (lat === 0 && lng === 0) return null; // Skip invalid defaults

                        return (
                            <Marker key={slot._id} position={[lat, lng]}>
                                <Popup>
                                    <div className="min-w-[150px]">
                                        <h3 className="font-bold text-gray-900">{slot.name}</h3>
                                        <p className="text-sm text-gray-600 mb-2">₹{slot.pricePerHour}/hr</p>
                                        <button
                                            onClick={() => navigate(`/slot/${slot._id}`)}
                                            className="bg-primary text-white px-3 py-1 rounded text-xs w-full hover:bg-blue-600 transition"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    }
                    return null;
                })}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
