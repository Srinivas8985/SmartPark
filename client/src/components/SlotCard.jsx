import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from './GlassCard';
import './SlotCard.css';

const SlotCard = ({ slot }) => {
    const navigate = useNavigate();

    const isLocked = slot.locked && slot.lockExpiry && Date.now() < slot.lockExpiry;
    const isFull = slot.availableSpots === 0;

    return (
        <GlassCard className="slot-card card-hover hover:border-primary/50 transition-colors animate-slide-up">
            <div className="slot-card-header mb-4">
                <div>
                    <h3 className="text-xl font-black mb-1">{slot.name}</h3>
                    <p className="text-xs text-muted font-mono bg-surface-color inline-block px-2 py-1 rounded-md">📍 {slot.address}</p>
                </div>
                {slot.smartPrice > slot.pricePerHour ? (
                    <div className="badge badge-warning flex gap-1 items-center"><span className="animate-pulse">⚡</span> High Demand</div>
                ) : slot.smartPrice < slot.pricePerHour ? (
                    <div className="badge badge-info text-xs">🌙 Off-Peak</div>
                ) : null}
            </div>

            <div className="slot-card-body flex-1 flex flex-col justify-end">
                <div className="slot-price py-4 border-t border-b border-[var(--border-color)] mb-4">
                    <span className="text-4xl font-black text-gradient">₹{slot.smartPrice || slot.pricePerHour}</span>
                    <span className="text-muted text-sm font-bold">/ hour</span>
                </div>
                
                <div className="slot-stats grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-surface-color p-3 rounded-xl border border-[var(--border-color)]">
                        <div className="text-[10px] uppercase font-black text-muted tracking-wider mb-1">Capacity</div>
                        <div className="font-bold text-lg">{slot.availableSpots}<span className="text-muted text-sm">/{slot.totalSpots}</span></div>
                    </div>
                    <div className="bg-surface-color p-3 rounded-xl border border-[var(--border-color)] text-right">
                        <div className="text-[10px] uppercase font-black text-muted tracking-wider mb-1">Network Rating</div>
                        <div className="font-bold text-lg flex justify-end items-center gap-1">
                            <span className="text-accent">★</span> 
                            {(slot.rating || 0).toFixed(1)}
                        </div>
                    </div>
                </div>

                <div className="slot-actions mt-auto">
                    <button 
                        onClick={() => navigate(`/slot/${slot._id}`)}
                        className={`btn w-full shadow-lg text-lg ${isLocked || isFull ? 'btn-outline opacity-50 cursor-not-allowed' : 'btn-primary'}`}
                        disabled={isLocked || isFull}
                    >
                        {isLocked ? '🔒 Cryptographic Lock Active' : isFull ? 'Capacity Exceeded' : 'Reserve Terminal →'}
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};

export default SlotCard;
