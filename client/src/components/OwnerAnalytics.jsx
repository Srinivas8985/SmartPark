import React, { useEffect, useState } from 'react';
import api from '../services/api';
import GlassCard from './GlassCard';

/* Inline CSS needed because Recharts adds its own SVGs */
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const OwnerAnalytics = () => {
    const [stats, setStats] = useState({ totalRevenue: 0, totalBookings: 0, activeSlots: 0 });
    const [weeklyData, setWeeklyData] = useState([]);
    const [slotPerformance, setSlotPerformance] = useState([]);
    const [smartPricingData, setSmartPricingData] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#2563eb', '#0891b2', '#8b5cf6', '#10b981', '#f59e0b'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                // Mock integration logic that would usually hit /admin/analytics or similar owner route
                const bRes = await api.get('/bookings/owner-bookings');
                const bookings = bRes.data;

                const revenue = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED').reduce((acc, b) => acc + b.totalAmount, 0);
                
                setStats({
                    totalRevenue: revenue,
                    totalBookings: bookings.length,
                    activeSlots: new Set(bookings.map(b => b.slotId)).size
                });

                // Mock Weekly Revenue Data
                setWeeklyData([
                    { name: 'Mon', revenue: 1200, bookings: 4 },
                    { name: 'Tue', revenue: 1900, bookings: 7 },
                    { name: 'Wed', revenue: 1500, bookings: 5 },
                    { name: 'Thu', revenue: 2200, bookings: 8 },
                    { name: 'Fri', revenue: 3500, bookings: 12 },
                    { name: 'Sat', revenue: 4800, bookings: 16 },
                    { name: 'Sun', revenue: 4200, bookings: 14 }
                ]);

                // Mock Slot Performance
                setSlotPerformance([
                    { name: 'MG Road Slot A', bookings: 45, fillRate: 85 },
                    { name: 'Indiranagar VIP', bookings: 32, fillRate: 60 },
                    { name: 'Koramangala 4th Blk', bookings: 58, fillRate: 92 },
                    { name: 'Whitefield Tech Park', bookings: 24, fillRate: 40 }
                ]);

                // Smart Pricing Impact
                setSmartPricingData([
                    { hour: '08:00', originalRate: 50, smartRate: 50, demand: 'Normal' },
                    { hour: '13:00', originalRate: 50, smartRate: 65, demand: 'High' },
                    { hour: '18:00', originalRate: 50, smartRate: 80, demand: 'Peak Surge' },
                    { hour: '23:00', originalRate: 50, smartRate: 35, demand: 'Low' }
                ]);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="grid md-grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-32 bg-surface border border-color rounded-xl" />)}
                <div className="md:col-span-2 h-80 bg-surface border border-color rounded-xl" />
                <div className="h-80 bg-surface border border-color rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md-grid-cols-3 gap-4 mb-6">
                <GlassCard className="border-r-4" style={{ borderRightColor: 'var(--primary)' }}>
                    <p className="text-sm text-muted font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black text-primary mb-2">₹{stats.totalRevenue.toLocaleString()}</h3>
                    <p className="text-xs text-success font-bold flex items-center gap-1">↗ +14.5% <span className="text-muted font-normal">from last month</span></p>
                </GlassCard>
                <GlassCard className="border-r-4" style={{ borderRightColor: 'var(--secondary)' }}>
                    <p className="text-sm text-muted font-bold uppercase tracking-wider mb-1">Total Bookings</p>
                    <h3 className="text-3xl font-black text-secondary mb-2">{stats.totalBookings}</h3>
                    <p className="text-xs text-success font-bold flex items-center gap-1">↗ +5.2% <span className="text-muted font-normal">from last month</span></p>
                </GlassCard>
                <GlassCard className="border-r-4" style={{ borderRightColor: 'var(--accent)' }}>
                    <p className="text-sm text-muted font-bold uppercase tracking-wider mb-1">Active Slots</p>
                    <h3 className="text-3xl font-black text-accent mb-2">{stats.activeSlots}</h3>
                    <p className="text-xs text-info font-bold flex items-center gap-1">→ 0.0% <span className="text-muted font-normal">from last month</span></p>
                </GlassCard>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 gap-6 mb-6">
                <GlassCard>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">📈 Weekly Revenue Trend</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} />
                                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', boxShadow: 'var(--shadow-lg)' }} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, strokeWidth: 2, fill: 'var(--bg-color)' }} activeDot={{ r: 8, fill: 'var(--primary)', stroke: 'white' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <div className="grid md-grid-cols-2 gap-6">
                    <GlassCard>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">🏆 Slot Performance (Bookings)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={slotPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} horizontal={false} />
                                    <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: 'var(--text-main)', fontSize: 11, fontWeight: 600 }} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'rgba(37,99,235,0.05)' }} contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }} />
                                    <Bar dataKey="bookings" name="Total Bookings" fill="var(--secondary)" radius={[0, 8, 8, 0]}>
                                        {slotPerformance.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>

                    <GlassCard>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">🎯 Customer Segment (Demo)</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={[{name: 'Commuters', value: 45}, {name: 'Shoppers', value: 30}, {name: 'Residents', value: 15}, {name: 'Tourists', value: 10}]} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                                        {[{name: 'Commuters', value: 45}, {name: 'Shoppers', value: 30}, {name: 'Residents', value: 15}, {name: 'Tourists', value: 10}].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '12px', color: 'var(--text-main)' }} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </div>
            </div>

            {/* Smart Pricing Impact Table */}
            <GlassCard className="p-0 overflow-hidden mt-6">
                <div className="p-6 border-b border-color flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2">⚡ Smart Pricing Engine Tracker</h3>
                    <span className="badge badge-info text-xs">Live Data</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table className="w-full text-left">
                        <thead className="bg-surface text-muted text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4 border-b border-color">Time Slot</th>
                                <th className="p-4 border-b border-color">Demand Level</th>
                                <th className="p-4 border-b border-color">Base Rate</th>
                                <th className="p-4 border-b border-color">Smart Rate</th>
                                <th className="p-4 border-b border-color">Revenue Impact</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y border-color">
                            {smartPricingData.map((row, i) => {
                                const diff = row.smartRate - row.originalRate;
                                const diffPercentage = ((diff / row.originalRate) * 100).toFixed(0);
                                
                                return (
                                    <tr key={i} className="hover:bg-bg transition-colors">
                                        <td className="p-4 font-bold">{row.hour}</td>
                                        <td className="p-4">
                                            <span className={`badge ${
                                                row.demand.includes('Peak') ? 'badge-danger' :
                                                row.demand === 'High' ? 'badge-warning' :
                                                row.demand === 'Low' ? 'badge-info' : 'badge-success'
                                            }`}>
                                                {row.demand}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted">₹{row.originalRate}</td>
                                        <td className="p-4 font-black">₹{row.smartRate}</td>
                                        <td className="p-4">
                                            {diff > 0 ? (
                                                <span className="text-success font-bold flex items-center gap-1">↑ +{diffPercentage}%</span>
                                            ) : diff < 0 ? (
                                                <span className="text-danger font-bold flex items-center gap-1">↓ {diffPercentage}%</span>
                                            ) : (
                                                <span className="text-muted font-bold">— 0%</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default OwnerAnalytics;
