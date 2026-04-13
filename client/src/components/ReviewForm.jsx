import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import GlassCard from './GlassCard';
import { StarRating } from './ReviewList';

const ReviewForm = ({ slotId, onReviewAdded }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/reviews', { slotId, rating, comment });
            showToast('Review submitted successfully!', 'success');
            setComment('');
            setRating(5);
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            showToast('Failed to submit review', 'error');
        }
        setLoading(false);
    };

    return (
        <GlassCard className="animate-fade">
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="input-label mb-2 block">Rate your experience</label>
                    <div className="flex justify-center p-4 bg-bg rounded-xl border border-color">
                        <StarRating rating={rating} setRating={setRating} interactive={true} />
                    </div>
                </div>

                <div className="input-group">
                    <label className="input-label block mb-2">Detailed Review</label>
                    <textarea 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)} 
                        className="input-field w-full"
                        rows="4" 
                        placeholder="Was the parking spot easy to find? Clean? Safe?" 
                        required 
                    />
                </div>

                <button type="submit" disabled={loading} className="btn w-full btn-primary mt-2">
                    {loading ? <span className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }} /> : 'Post Review →'}
                </button>
            </form>
        </GlassCard>
    );
};

export default ReviewForm;
