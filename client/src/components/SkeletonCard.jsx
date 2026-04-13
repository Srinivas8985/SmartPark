import React from 'react';
import GlassCard from './GlassCard';

/* Inline CSS needed because shimmer is applied via global index.css */
export const SkeletonCard = () => {
    return (
        <GlassCard className="skeleton-card overflow-hidden">
            <div className="skeleton-shimmer" style={{ height: '20px', width: '70%', marginBottom: '10px', borderRadius: '4px' }} />
            <div className="skeleton-shimmer" style={{ height: '14px', width: '40%', marginBottom: '20px', borderRadius: '4px' }} />

            <div className="flex items-end gap-2 mb-4">
                <div className="skeleton-shimmer" style={{ height: '30px', width: '50px', borderRadius: '4px' }} />
                <div className="skeleton-shimmer" style={{ height: '14px', width: '30px', borderRadius: '4px' }} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                    <div className="skeleton-shimmer" style={{ height: '12px', width: '100%', marginBottom: '4px', borderRadius: '2px' }} />
                    <div className="skeleton-shimmer" style={{ height: '16px', width: '50%', borderRadius: '4px' }} />
                </div>
                <div>
                    <div className="skeleton-shimmer" style={{ height: '12px', width: '100%', marginBottom: '4px', borderRadius: '2px' }} />
                    <div className="skeleton-shimmer" style={{ height: '16px', width: '50%', borderRadius: '4px' }} />
                </div>
            </div>

            <div className="mt-6">
                <div className="skeleton-shimmer" style={{ height: '45px', width: '100%', borderRadius: '12px' }} />
            </div>
        </GlassCard>
    );
};

export const SkeletonGrid = ({ count = 6 }) => {
    return (
        <div className="grid md-grid-cols-3 gap-6">
            {Array(count).fill(0).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};
