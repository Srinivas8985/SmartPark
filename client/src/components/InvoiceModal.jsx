import React from 'react';
import GlassCard from './GlassCard';

const InvoiceModal = ({ booking, onClose }) => {
    if (!booking) return null;

    const handlePrint = () => {
        window.print();
    };

    const GST = (booking.totalAmount * 0.18).toFixed(2);
    const BASE = (booking.totalAmount - GST).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade" style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <GlassCard className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl overflow-hidden animate-bounce-in relative" style={{ width: '100%', maxWidth: '28rem', margin: 'auto' }}>
                
                {/* Print wrapper to hide buttons during print */}
                <div id="invoice-content" className="p-6">
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-2">🅿️</div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">ParkSmart</h2>
                        <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest mt-1">Tax Invoice</p>
                    </div>

                    <div className="mb-6 pb-6 border-b border-color border-dashed flex justify-between text-sm">
                        <div>
                            <p className="text-muted mb-1">Invoice No.</p>
                            <p className="font-bold">{booking.invoiceNumber || `INV-${booking._id.substring(0,6).toUpperCase()}`}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-muted mb-1">Date</p>
                            <p className="font-bold">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="bg-surface p-4 rounded-xl border border-color">
                            <p className="text-xs text-muted mb-1">Billed To:</p>
                            <p className="font-bold text-lg mb-1">{booking.driver?.name || 'Customer'}</p>
                            <p className="text-sm text-muted">Parking Spot: <span className="font-semibold text-main">{booking.slot?.name}</span></p>
                            <p className="text-xs text-muted mt-1">{booking.slot?.address}</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-color text-muted text-left">
                                    <th className="pb-2 font-normal">Description</th>
                                    <th className="pb-2 font-normal text-center">Hrs</th>
                                    <th className="pb-2 font-normal text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-color">
                                <tr>
                                    <td className="py-3 font-semibold">Parking Charges</td>
                                    <td className="py-3 text-center">{booking.hours || 1}</td>
                                    <td className="py-3 text-right">₹{BASE}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2" className="py-3 text-right text-muted">GST (18%)</td>
                                    <td className="py-3 text-right font-semibold">₹{GST}</td>
                                </tr>
                            </tbody>
                            <tfoot className="border-t-2 border-solid border-color text-lg">
                                <tr>
                                    <td colSpan="2" className="pt-3 font-black text-primary">Grand Total</td>
                                    <td className="pt-3 font-black text-primary text-right">₹{booking.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="text-center text-xs text-muted mt-8">
                        <p>Paid electronically via Secure Gateway</p>
                        <p className="mt-1">Thank you for choosing ParkSmart.</p>
                    </div>
                </div>

                <div className="p-4 bg-surface border-t border-color flex gap-3 no-print mt-auto">
                    <button onClick={onClose} className="btn btn-outline flex-1">Close</button>
                    <button onClick={handlePrint} className="btn btn-primary flex-1">🖨️ Print Invoice</button>
                </div>
            </GlassCard>
        </div>
    );
};

export default InvoiceModal;
