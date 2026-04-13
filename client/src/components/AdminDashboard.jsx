import React, { useState, useEffect } from 'react';
import api from '../services/api';
import GlassCard from './GlassCard';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('users');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [usersRes, slotsRes] = await Promise.all([
                api.get('/users'),
                api.get('/slots')
            ]);
            setUsers(usersRes.data);
            setSlots(slotsRes.data);
        } catch (err) {
            console.error('Failed to fetch admin data', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete user?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteSlot = async (id) => {
        if (!window.confirm('Delete slot?')) return;
        try {
            await api.delete(`/admin/slots/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div className="flex justify-center py-20"><div className="spinner" /></div>;
    }

    return (
        <div className="admin-dashboard container pt-header pb-12">
            <div className="admin-header flex justify-between items-end flex-wrap gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black mb-1">Admin Portal <span className="badge badge-danger">ROOT</span></h1>
                    <p className="text-muted text-sm">Manage users, slots, and platform integrity.</p>
                </div>
            </div>

            <div className="grid md-grid-cols-2 gap-6 mb-8">
                <GlassCard className="text-center p-6 border-info border">
                    <div className="text-3xl font-black text-info mb-1">{users.length}</div>
                    <div className="text-sm font-semibold text-muted uppercase tracking-wider">Registered Users</div>
                </GlassCard>
                <GlassCard className="text-center p-6 border-accent border">
                    <div className="text-3xl font-black text-accent mb-1">{slots.length}</div>
                    <div className="text-sm font-semibold text-muted uppercase tracking-wider">Active Slots</div>
                </GlassCard>
            </div>

            <div className="tabs-container glass mb-6" style={{ display: 'inline-flex' }}>
                <button className={`tab-btn ${view === 'users' ? 'active' : ''}`} onClick={() => setView('users')}>Users Registry</button>
                <button className={`tab-btn ${view === 'slots' ? 'active' : ''}`} onClick={() => setView('slots')}>Parking Slots</button>
            </div>

            <GlassCard className="p-0 overflow-hidden">
                <div style={{ overflowX: 'auto' }}>
                    <table className="admin-table w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface text-muted text-xs uppercase tracking-wider">
                                {view === 'users' ? (
                                    <>
                                        <th className="p-4 border-b border-color">User</th>
                                        <th className="p-4 border-b border-color">Role</th>
                                        <th className="p-4 border-b border-color">Joined</th>
                                        <th className="p-4 border-b border-color text-right">Actions</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="p-4 border-b border-color">Slot Name</th>
                                        <th className="p-4 border-b border-color">Owner ID</th>
                                        <th className="p-4 border-b border-color">Rate</th>
                                        <th className="p-4 border-b border-color text-right">Actions</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y border-color">
                            {view === 'users' ? users.map(u => (
                                <tr key={u._id} className="hover-bg transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar text-xs" style={{ width: '2rem', height: '2rem' }}>{u.name.charAt(0)}</div>
                                            <div>
                                                <div className="font-bold text-sm">{u.name}</div>
                                                <div className="text-xs text-muted">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4"><span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'OWNER' ? 'badge-info' : 'badge-success'}`}>{u.role}</span></td>
                                    <td className="p-4 text-sm text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 text-right">
                                        {u.role !== 'ADMIN' && (
                                            <button onClick={() => handleDeleteUser(u._id)} className="btn-sm text-danger hover-bg rounded px-2 py-1 transition-colors">Delete</button>
                                        )}
                                    </td>
                                </tr>
                            )) : slots.map(s => (
                                <tr key={s._id} className="hover-bg transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-sm">{s.name}</div>
                                        <div className="text-xs text-muted line-clamp-1">{s.address}</div>
                                    </td>
                                    <td className="p-4 text-xs text-muted break-all max-w-[150px]">{s.owner}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-success text-sm">₹{s.pricePerHour}/hr</div>
                                        <div className="text-xs text-muted">Spots: {s.totalSpots}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDeleteSlot(s._id)} className="btn-sm text-danger hover-bg rounded px-2 py-1 transition-colors">Remove</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default AdminDashboard;
