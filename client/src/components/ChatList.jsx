import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import GlassCard from './GlassCard';

const ChatList = ({ onSelectUser }) => {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConvos = async () => {
            try {
                // In a real app we hit /chat/conversations
                // Using mock data from our api layer
                const res = await api.get('/chat/conversations');
                setConversations(res.data);
            } catch (err) {
                console.error("Failed to load conversations", err);
            }
            setLoading(false);
        };
        fetchConvos();
        
        // Polling to keep unread badges updated in mock environment
        const interval = setInterval(fetchConvos, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="flex justify-center p-8"><div className="spinner" /></div>;

    if (conversations.length === 0) {
        return (
            <GlassCard className="text-center p-8">
                <div className="text-4xl mb-3">💬</div>
                <h3 className="font-bold mb-1">No Conversations</h3>
                <p className="text-sm text-muted">You have not sent or received any messages yet.</p>
            </GlassCard>
        );
    }

    return (
        <div className="grid md:grid-cols-2 gap-4">
            {conversations.map(c => (
                <div 
                    key={c._id} 
                    onClick={() => onSelectUser({ _id: c.userId, name: c.userName })}
                    className="card cursor-pointer hover:border-primary transition-all p-4 flex items-center gap-4"
                >
                    <div className="avatar">{c.userName?.charAt(0) || 'U'}</div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="font-bold">{c.userName}</h4>
                            <span className="text-xs text-muted">
                                {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-sm text-muted line-clamp-1">{c.lastMessage}</p>
                    </div>
                    {c.unreadCount > 0 && (
                        <div className="badge badge-danger rounded-full px-2 py-0.5">{c.unreadCount}</div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ChatList;
