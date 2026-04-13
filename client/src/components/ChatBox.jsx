import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';

/* Since we use LocalStorage for mock backend, polling is necessary for real-time feel */
const ChatBox = ({ receiverId, receiverName, onClose }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const CACHE_KEY = `chat_${user._id}_${receiverId}`;

    const loadMessages = () => {
        const stored = localStorage.getItem('parksmart_chats') || '[]';
        const allChats = JSON.parse(stored);
        
        const myChats = allChats.filter(m => 
            (m.senderId === user._id && m.receiverId === receiverId) ||
            (m.senderId === receiverId && m.receiverId === user._id)
        );
        
        setMessages(myChats);
    };

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 5000); // Polling for mock real-time
        return () => clearInterval(interval);
    }, [receiverId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msgObj = {
            _id: Date.now().toString(),
            senderId: user._id,
            receiverId: receiverId,
            text: newMessage,
            createdAt: new Date().toISOString()
        };

        const stored = localStorage.getItem('parksmart_chats') || '[]';
        const allChats = JSON.parse(stored);
        allChats.push(msgObj);
        localStorage.setItem('parksmart_chats', JSON.stringify(allChats));

        setMessages(prev => [...prev, msgObj]);
        setNewMessage('');
    };

    return (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: '22rem', zIndex: 100 }} className="animate-slide-in">
            <div className="card p-0 overflow-hidden shadow-2xl flex flex-col" style={{ height: '28rem', background: 'var(--surface-color)' }}>
                {/* Header */}
                <div style={{ padding: '1rem', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="flex items-center justify-center font-bold text-primary bg-white rounded-full" style={{ width: '2rem', height: '2rem', fontSize: '0.75rem' }}>
                            {receiverName?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>{receiverName}</h3>
                            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ padding: '0.25rem', opacity: 0.8, fontWeight: 'bold', fontSize: '1.25rem' }}>
                        ✕
                    </button>
                </div>

                {/* Messages Area */}
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: 'var(--bg-color)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {messages.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 'auto', marginBottom: 'auto' }}>
                            No messages yet. Say hi! 👋
                        </p>
                    ) : (
                        messages.map(msg => {
                            const isMe = msg.senderId === user._id;
                            return (
                                <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                                    <div style={{
                                        maxWidth: '75%', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.875rem',
                                        background: isMe ? 'var(--primary)' : 'var(--surface-color)',
                                        color: isMe ? 'white' : 'var(--text-main)',
                                        border: isMe ? 'none' : '1px solid var(--border-color)',
                                        borderBottomRightRadius: isMe ? 0 : '0.75rem',
                                        borderBottomLeftRadius: isMe ? '0.75rem' : 0
                                    }}>
                                        <div>{msg.text}</div>
                                        <div style={{ fontSize: '0.65rem', textAlign: 'right', marginTop: '0.25rem', opacity: isMe ? 0.8 : 0.5 }}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} style={{ display: 'flex', borderTop: '1px solid var(--border-color)', background: 'var(--surface-color)', padding: '0.75rem' }}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input-field"
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0, background: 'var(--bg-color)' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '0 1rem', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
