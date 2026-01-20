
import React, { useState } from 'react';
import { Download, CheckCircle2, Clock, ChevronRight, X, FileText } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Bill } from '../../types';
import { Logo } from '../../components/Logo';

const RenterPayments: React.FC = () => {
    // Filter bills for logged in tenant 't1'
    const [bills] = useState<Bill[]>(DataService.getBills().filter(b => b.tenant_id === 't1'));
    const [viewReceipt, setViewReceipt] = useState<Bill | null>(null);

    const paidBills = bills.filter(b => b.status === 'paid');
    const unpaidBills = bills.filter(b => b.status !== 'paid');

    const handlePay = (billId: string) => {
        if(confirm("Confirm payment via mobile banking?")) {
            DataService.updateBill(billId, { status: 'paid', paid_date: new Date().toISOString() });
            window.location.reload(); // Simple reload to refresh data for demo
        }
    };

    const ReceiptModal = () => {
        if (!viewReceipt) return null;
        return (
            <div className="fixed inset-0 bg-black/80 z-[80] flex flex-col items-center justify-center p-4 backdrop-blur-md">
                <div className="bg-white w-full max-w-sm rounded-[1.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <div className="bg-[#2d1b4e] p-6 text-white text-center relative">
                        <button onClick={() => setViewReceipt(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                        <div className="mb-3 flex justify-center scale-90"><Logo light size="sm"/></div>
                        <h2 className="text-xl font-bold mb-1">Payment Receipt</h2>
                        <p className="text-xs opacity-70">#{viewReceipt.id.slice(-6).toUpperCase()}</p>
                    </div>
                    
                    <div className="p-6">
                         <div className="text-center mb-6 mt-2">
                             <h3 className="text-2xl font-extrabold text-gray-900">৳ {viewReceipt.total.toLocaleString()}</h3>
                             <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase mt-2 bg-green-100 text-green-700">
                                 <CheckCircle2 size={12}/> Paid on {new Date(viewReceipt.paid_date!).toLocaleDateString()}
                             </div>
                         </div>
                         
                         <div className="space-y-3 mb-6 border-t border-b border-gray-100 py-4">
                             <div className="flex justify-between text-sm"><span className="text-gray-500">Rent</span><span className="font-bold">৳ {viewReceipt.rent_amount}</span></div>
                             {viewReceipt.service_charge > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Service</span><span className="font-bold">৳ {viewReceipt.service_charge}</span></div>}
                             {viewReceipt.electricity_bill! > 0 && <div className="flex justify-between text-sm"><span className="text-gray-500">Electricity</span><span className="font-bold">৳ {viewReceipt.electricity_bill}</span></div>}
                             {(viewReceipt.gas_bill > 0 || viewReceipt.water_bill > 0) && <div className="flex justify-between text-sm"><span className="text-gray-500">Utility</span><span className="font-bold">৳ {viewReceipt.gas_bill + viewReceipt.water_bill}</span></div>}
                         </div>

                         <button className="w-full py-3 bg-[#2d1b4e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Download size={16}/> Download PDF</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-5 pb-32 min-h-screen bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payments</h2>

            {/* Unpaid Section */}
            {unpaidBills.length > 0 && (
                <div className="mb-8">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Due Now</h3>
                    {unpaidBills.map(bill => (
                        <div key={bill.id} className="bg-white p-5 rounded-3xl border border-red-100 shadow-sm mb-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-6 -mt-6"></div>
                            <div className="relative">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{new Date(bill.month).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</p>
                                        <p className="text-xs text-red-500 font-bold mt-1">Payment Pending</p>
                                    </div>
                                    <h4 className="text-xl font-extrabold text-gray-900">৳ {bill.total.toLocaleString()}</h4>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                                    <button onClick={() => {}} className="flex-1 py-3 text-xs font-bold text-gray-600 bg-gray-50 rounded-xl">View Details</button>
                                    <button onClick={() => handlePay(bill.id)} className="flex-1 py-3 text-xs font-bold text-white bg-[#ff4b9a] rounded-xl shadow-lg shadow-pink-200">Pay Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* History Section */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Payment History</h3>
                <div className="space-y-3">
                    {paidBills.map(bill => (
                        <div key={bill.id} onClick={() => setViewReceipt(bill)} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                                    <FileText size={18}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900">{new Date(bill.month).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</h4>
                                    <p className="text-[10px] text-gray-400">Paid on {new Date(bill.paid_date!).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm text-gray-900">৳ {bill.total.toLocaleString()}</p>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Paid</span>
                            </div>
                        </div>
                    ))}
                    {paidBills.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No payment history.</p>}
                </div>
            </div>

            {viewReceipt && <ReceiptModal />}
        </div>
    );
};

export default RenterPayments;
