import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import Button from './Button';
import api from '../services/api';

const ReceiptModal = ({ booking, onClose }) => {
    const [qrCode, setQrCode] = useState(null);

    useEffect(() => {
        const fetchQR = async () => {
            try {
                const res = await api.get(`/bookings/${booking._id}/qr`);
                setQrCode(res.data.qrCode);
            } catch (err) {
                console.error("Failed to load QR", err);
            }
        };
        fetchQR();
    }, [booking._id]);

    if (!booking) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
            <div className="relative w-full max-w-md bg-white dark:bg-surface rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:w-full">
                {/* Header */}
                <div className="bg-primary p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Parking Receipt</h2>
                    <p className="opacity-80 text-sm mt-1">SmartPark System</p>
                </div>

                {/* Ticket Body */}
                <div className="p-8 space-y-6">
                    <div className="text-center pb-6 border-b border-dashed border-gray-300 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Total Paid</p>
                        <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">₹{booking.totalAmount}</p>
                        <div className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                            {booking.status}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Booking ID</span>
                            <span className="font-mono font-medium text-gray-900 dark:text-white">#{booking._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Slot</span>
                            <span className="font-medium text-gray-900 dark:text-white">{booking.slot.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Date</span>
                            <span className="font-medium text-gray-900 dark:text-white">{new Date(booking.startTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-gray-400">Time</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        {booking.driver && (
                            <div className="flex justify-between">
                                <span className="text-gray-500 dark:text-gray-400">Driver</span>
                                <span className="font-medium text-gray-900 dark:text-white">{booking.driver.name}</span>
                            </div>
                        )}
                    </div>

                    <div className="text-center pt-4">
                        {qrCode ? (
                            <div className="flex flex-col items-center">
                                <img src={qrCode} alt="Booking QR Code" className="w-32 h-32 mb-2 p-2 bg-white rounded-lg border border-gray-200" />
                                <p className="text-xs text-gray-500">Scan this at entry</p>
                            </div>
                        ) : (
                            <p className="text-xs text-gray-400">Loading QR...</p>
                        )}
                    </div>

                    <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-xs text-gray-400">Thank you for using SmartPark!</p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex gap-4 print:hidden">
                    <Button text="Close" variant="secondary" onClick={onClose} className="w-1/2" />
                    <Button text="Print" onClick={handlePrint} className="w-1/2" />
                </div>
            </div>
        </div>
    );
};

export default ReceiptModal;
