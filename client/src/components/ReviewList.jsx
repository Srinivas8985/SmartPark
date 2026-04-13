import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from './GlassCard';

export const StarRating = ({ rating, setRating, interactive = false }) => {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type={interactive ? "button" : "submit"}
                    style={{ cursor: interactive ? 'pointer' : 'default', transition: 'all 0.2s', padding: '0.2rem' }}
                    onClick={() => interactive && setRating(star)}
                    className={`${star <= rating ? 'text-accent' : 'text-gray-300 dark:text-gray-600'} ${interactive ? 'hover:scale-125' : ''}`}
                    disabled={!interactive}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </button>
            ))}
        </div>
    );
};

export const ReviewList = ({ slotId, refreshTrigger }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/slot/${slotId}`);
                setReviews(res.data);
            } catch (err) {
                console.error('Error fetching reviews', err);
            }
            setLoading(false);
        };
        fetchReviews();
    }, [slotId, refreshTrigger]);

    if (loading) return <div className="spinner" style={{ margin: '2rem auto' }} />;
    if (reviews.length === 0) return <div className="text-muted text-sm italic">No reviews yet. Be the first!</div>;

    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="text-4xl font-black text-accent">{avgRating.toFixed(1)}</div>
                <div>
                    <StarRating rating={Math.round(avgRating)} />
                    <div className="text-xs text-muted mt-1">Based on {reviews.length} reviews</div>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {reviews.map((r, i) => (
                    <GlassCard key={i} className="p-4 animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className="avatar text-xs" style={{ width: '2rem', height: '2rem' }}>
                                    {r.userName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm">{r.userName || 'Verified User'}</h4>
                                    <div className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>
                            <StarRating rating={r.rating} />
                        </div>
                        <p className="text-sm mt-2">{r.comment}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
