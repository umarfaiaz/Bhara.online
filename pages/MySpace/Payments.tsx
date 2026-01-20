
import React, { useState, useEffect } from 'react';
import { ChevronDown, Send, CheckCircle2, MoreHorizontal, Info, ChevronRight, X, Zap, Droplets, Flame, RefreshCcw, Edit3, Trash2, Fuel, PenTool, Wrench, Camera, Car, Home, ArrowLeft, ArrowRight, Share2, Download, Printer, Calendar, Filter, PlusCircle, Building2, AlertTriangle, FileText, CheckSquare, Square, Plus } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Bill, AssetType } from '../../types';

// ... (Existing Payments Logic - focusing on Modals)
const Payments: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'due' | 'paid'>('all');
  const [assetFilter, setAssetFilter] = useState<'all' | AssetType>('all');
  const [bills, setBills] = useState<Bill[]>([]);
  const [stats, setStats] = useState(DataService.getStats());
  
  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedBillIds, setSelectedBillIds] = useState<Set<string>>(new Set());
  
  // Modals & Views
  const [showAddCharges, setShowAddCharges] = useState<Bill | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<Bill | null>(null);
  const [showStatusModal, setShowStatusModal] = useState<Bill | null>(null);
  const [showBulkChargeModal, setShowBulkChargeModal] = useState(false);
  const [viewBill, setViewBill] = useState<Bill | null>(null);

  const refreshData = () => {
    setBills(DataService.getBills());
    setStats(DataService.getStats());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 2000);
    return () => clearInterval(interval);
  }, []);

  const filteredBills = bills.filter(b => {
    const statusMatch = filter === 'all' || (filter === 'due' ? b.status === 'unpaid' : b.status === 'paid');
    const assetMatch = assetFilter === 'all' || b.asset_type === assetFilter;
    return statusMatch && assetMatch;
  });

  const totalPossible = stats.totalCollected + stats.totalPending;
  const progressPercent = totalPossible > 0 ? (stats.totalCollected / totalPossible) * 100 : 0;

  // Toggle Selection Mode
  const toggleSelectionMode = () => {
      const newMode = !isSelectionMode;
      setIsSelectionMode(newMode);
      if (!newMode) setSelectedBillIds(new Set()); // Clear selection when exiting
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedBillIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedBillIds(newSet);
  };

  const selectAll = () => {
    if (selectedBillIds.size === filteredBills.length) setSelectedBillIds(new Set());
    else setSelectedBillIds(new Set(filteredBills.map(b => b.id)));
  };

  const handleBulkUpdate = () => {
      if (confirm(`Mark ${selectedBillIds.size} bills as Paid?`)) {
          selectedBillIds.forEach(id => {
              DataService.updateBill(id, { status: 'paid', paid_date: new Date().toISOString() });
          });
          setIsSelectionMode(false);
          setSelectedBillIds(new Set());
          refreshData();
      }
  };

  const getAssetIcon = (type: AssetType) => {
      switch(type) {
          case 'Vehicle': return <Car size={16} className="text-indigo-600"/>;
          case 'Gadget': return <Camera size={16} className="text-orange-600"/>;
          default: return <Home size={16} className="text-pink-600"/>;
      }
  }

  return (
    <div className="p-5 space-y-6 pb-32 max-w-lg mx-auto bg-gray-50 min-h-screen">
      
      {/* 1. Header Card */}
      {!isSelectionMode && (
          <div className="bg-[#2d1b4e] rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden transition-all duration-300 transform">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
             <div className="relative z-10">
                 <div className="flex justify-between items-start mb-6">
                     <div>
                         <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Total Collections</p>
                         <h2 className="text-3xl font-extrabold">৳ {stats.totalCollected.toLocaleString()}</h2>
                     </div>
                     <div className="text-right">
                         <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mb-1">Pending</p>
                         <p className="text-lg font-bold text-[#ff4b9a]">৳ {stats.totalPending.toLocaleString()}</p>
                     </div>
                 </div>
                 
                 <div className="space-y-2">
                     <div className="flex justify-between text-[11px] font-medium text-white/80">
                         <span>Progress</span>
                         <span>{progressPercent.toFixed(0)}%</span>
                     </div>
                     <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-[#ff4b9a] transition-all duration-700" style={{ width: `${progressPercent}%` }}></div>
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* 2. Controls Bar */}
      <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-sm py-2 space-y-3 -mx-5 px-5 transition-all">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{isSelectionMode ? 'Select Items' : 'Transactions'}</h3>
            <button 
                onClick={toggleSelectionMode}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isSelectionMode 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
                {isSelectionMode ? 'Cancel' : 'Select'}
            </button>
        </div>

        {!isSelectionMode && (
            <div className="space-y-3 animate-in slide-in-from-top-2">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { id: 'all', label: 'All', icon: null },
                        { id: 'Residential', label: 'Property', icon: Building2 },
                        { id: 'Vehicle', label: 'Vehicle', icon: Car },
                        { id: 'Gadget', label: 'Gear', icon: Camera }
                    ].map(type => (
                        <button
                            key={type.id}
                            onClick={() => setAssetFilter(type.id as any)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all ${
                                assetFilter === type.id 
                                ? 'bg-gray-900 border-gray-900 text-white shadow-md' 
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                            {type.icon && <type.icon size={12} />}
                            {type.label}
                        </button>
                    ))}
                </div>

                <div className="flex bg-gray-200/50 p-1 rounded-xl">
                    {['all', 'due', 'paid'].map((f) => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase transition-all ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {f}
                    </button>
                    ))}
                </div>
            </div>
        )}

        {isSelectionMode && (
            <div className="flex items-center justify-between animate-in slide-in-from-top-2 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-500 ml-1">{selectedBillIds.size} Selected</span>
                <button onClick={selectAll} className="text-[#ff4b9a] text-xs font-bold hover:underline">
                    {selectedBillIds.size === filteredBills.length ? 'Deselect All' : 'Select All'}
                </button>
            </div>
        )}
      </div>

      {/* 3. Modern Bill Cards */}
      <div className="space-y-4 pb-20">
        {filteredBills.map((bill) => (
            <div 
                key={bill.id} 
                onClick={() => {
                    if (isSelectionMode) toggleSelection(bill.id);
                }}
                className={`bg-white rounded-[1.5rem] shadow-sm border border-gray-100 relative overflow-hidden transition-all duration-200 ${
                    isSelectionMode 
                        ? 'cursor-pointer active:scale-[0.98]' 
                        : ''
                } ${selectedBillIds.has(bill.id) ? 'border-[#ff4b9a] ring-2 ring-[#ff4b9a] bg-pink-50/10' : 'hover:shadow-md'}`}
            >
                {/* Checkbox Overlay */}
                {isSelectionMode && (
                    <div className="absolute top-4 right-4 z-20">
                         {selectedBillIds.has(bill.id) 
                            ? <CheckCircle2 size={24} className="text-[#ff4b9a] fill-white" /> 
                            : <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white"></div>
                         }
                    </div>
                )}

                {/* Card Header */}
                <div className="p-5 pb-0 flex items-start gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center shadow-inner text-xl border border-gray-100">
                        👤
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <h4 className="font-bold text-gray-900 text-base leading-tight">{bill.tenant_name}</h4>
                             <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 uppercase tracking-wide">
                                 {new Date(bill.month).toLocaleDateString('en-US', {month: 'short'})}
                             </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                             <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                {getAssetIcon(bill.asset_type)}
                                {bill.asset_name}
                             </div>
                        </div>
                     </div>
                </div>

                {/* Amount Section */}
                <div className="px-5 py-4">
                    <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-extrabold ${bill.status === 'paid' ? 'text-green-600' : 'text-gray-900'}`}>
                            ৳ {bill.total.toLocaleString()}
                        </span>
                        {bill.status === 'unpaid' && (
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wide">Due</span>
                        )}
                        {bill.status === 'partial' && (
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-wide">Partial</span>
                        )}
                        {bill.status === 'paid' && (
                             <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-wide">Paid</span>
                        )}
                    </div>
                </div>

                {/* Action Footer (Only visible when NOT in selection mode) */}
                {!isSelectionMode && (
                    <div className="bg-gray-50 border-t border-gray-100 p-2 flex items-center gap-2">
                        {/* Invoice Details */}
                        <button 
                            onClick={() => setViewBill(bill)}
                            className="flex-1 py-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                        >
                            <FileText size={16} className="text-gray-400"/> Details
                        </button>
                        
                        <div className="w-[1px] h-6 bg-gray-200"></div>

                        {bill.status === 'paid' ? (
                            <button 
                                onClick={() => setShowStatusModal(bill)}
                                className="flex-1 py-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <Edit3 size={16} className="text-gray-400"/> Edit Status
                            </button>
                        ) : (
                            <>
                                {/* Add Charge */}
                                <button 
                                    onClick={() => setShowAddCharges(bill)}
                                    className="flex-1 py-3 rounded-xl hover:bg-white border border-transparent hover:border-gray-200 text-gray-600 text-xs font-bold flex items-center justify-center gap-2 transition-all"
                                >
                                    <PlusCircle size={16} className="text-gray-400"/> Add Charge
                                </button>
                                
                                {/* Collect Button (Primary) */}
                                <button 
                                    onClick={() => setShowPaymentModal(bill)}
                                    className="flex-[1.5] py-3 rounded-xl bg-[#ff4b9a] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all"
                                >
                                    Collect <ArrowRight size={16}/>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        ))}
        
        {filteredBills.length === 0 && (
             <div className="text-center py-12">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                     <FileText size={30} />
                 </div>
                 <p className="text-gray-500 font-bold text-sm">No bills found.</p>
             </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {isSelectionMode && selectedBillIds.size > 0 && (
          <div className="fixed bottom-24 left-0 right-0 sm:left-auto sm:right-auto sm:w-full sm:max-w-md mx-auto z-40 bg-[#2d1b4e] text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center animate-in slide-in-from-bottom-5 border border-white/10 m-4">
              <span className="text-xs font-bold flex items-center gap-2">
                  <span className="bg-[#ff4b9a] w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{selectedBillIds.size}</span>
                  Selected
              </span>
              <div className="flex gap-3">
                  <button onClick={() => setShowBulkChargeModal(true)} className="px-4 py-2 bg-white/10 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">
                      + Add Charge
                  </button>
                  <button onClick={handleBulkUpdate} className="px-4 py-2 bg-[#ff4b9a] rounded-xl text-xs font-bold shadow-lg shadow-pink-900/40 hover:bg-[#e63e8a] transition-colors">
                      Mark Paid
                  </button>
              </div>
          </div>
      )}

      {/* --- Modals --- */}
      {viewBill && <BillDetailsView bill={viewBill} onClose={() => setViewBill(null)} onPay={() => { setViewBill(null); setShowPaymentModal(viewBill); }} />}
      {showAddCharges && <AddChargesModal bill={showAddCharges} onClose={() => { setShowAddCharges(null); refreshData(); }} />}
      {showBulkChargeModal && <BulkChargeModal billIds={Array.from(selectedBillIds)} onClose={() => { setShowBulkChargeModal(false); setIsSelectionMode(false); setSelectedBillIds(new Set()); refreshData(); }} />}
      {showPaymentModal && <PaymentConfirmationModal bill={showPaymentModal} onClose={() => { setShowPaymentModal(null); refreshData(); }} />}
      {showStatusModal && <ChangeStatusModal bill={showStatusModal} onClose={() => { setShowStatusModal(null); refreshData(); }} />}
    </div>
  );
};

// --- Responsive Modal Helper ---
const Modal: React.FC<{ children: React.ReactNode, onClose: () => void, title?: string }> = ({ children, onClose, title }) => (
    <div className="fixed inset-0 bg-black/60 z-[100] flex flex-col justify-end sm:justify-center items-center backdrop-blur-sm p-0 sm:p-4">
        <div className="bg-white w-full sm:max-w-md rounded-t-[2rem] sm:rounded-[2rem] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300 shadow-2xl max-h-[90vh]">
            {title && (
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
                </div>
            )}
            {children}
        </div>
    </div>
);

// --- Sub-components (Re-integrated) ---

const BulkChargeModal: React.FC<{ billIds: string[], onClose: () => void }> = ({ billIds, onClose }) => {
    const [amount, setAmount] = useState<number>(0);
    const [note, setNote] = useState('');

    const handleApply = () => {
        if (amount > 0) {
            billIds.forEach(id => {
                const bill = DataService.getBills().find(b => b.id === id);
                if (bill) {
                    DataService.updateBill(id, {
                        additional_charges_amount: (bill.additional_charges_amount || 0) + amount
                    });
                }
            });
            onClose();
        } else {
            alert("Enter amount");
        }
    }

    return (
        <Modal onClose={onClose} title="Add Bulk Charge">
            <div className="p-6 pt-2">
                <p className="text-xs text-gray-500 mb-6">Adding to {billIds.length} selected bills</p>
                <div className="space-y-4">
                    <div>
                         <label className="block text-xs font-bold text-gray-900 mb-2">Amount (৳)</label>
                         <input type="number" value={amount || ''} onChange={e => setAmount(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-[#ff4b9a] focus:outline-none focus:ring-2 focus:ring-[#ff4b9a]/20 transition-all"/>
                    </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-900 mb-2">Description</label>
                         <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Garbage Bill" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold focus:border-[#ff4b9a] focus:outline-none focus:ring-2 focus:ring-[#ff4b9a]/20 transition-all"/>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                         <button onClick={onClose} className="w-full py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                         <button onClick={handleApply} className="w-full py-3 bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg shadow-pink-200 hover:bg-[#e63e8a] transition-colors">Apply</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const BillDetailsView: React.FC<{ bill: Bill, onClose: () => void, onPay: () => void }> = ({ bill, onClose, onPay }) => {
    // ... (keep item generation logic same)
    const getInvoiceItems = () => {
        const items = [];
        if (bill.rent_amount) items.push({ label: bill.asset_type === 'Vehicle' ? 'Base Rate' : 'Monthly Rent', amount: bill.rent_amount });
        if (bill.service_charge) items.push({ label: 'Service Charge', amount: bill.service_charge });
        if (bill.electricity_bill) items.push({ label: 'Electricity', amount: bill.electricity_bill });
        if (bill.gas_bill) items.push({ label: 'Gas', amount: bill.gas_bill });
        if (bill.water_bill) items.push({ label: 'Water', amount: bill.water_bill });
        if (bill.fuel_cost) items.push({ label: 'Fuel', amount: bill.fuel_cost });
        if (bill.driver_allowance) items.push({ label: 'Driver', amount: bill.driver_allowance });
        if (bill.toll_cost) items.push({ label: 'Tolls', amount: bill.toll_cost });
        if (bill.damage_cost) items.push({ label: 'Damage', amount: bill.damage_cost });
        if (bill.late_fee) items.push({ label: 'Late Fee', amount: bill.late_fee });
        if (bill.other_bills) items.push({ label: 'Misc', amount: bill.other_bills });
        if (bill.additional_charges_amount) items.push({ label: 'Additional', amount: bill.additional_charges_amount });
        return items;
    };

    const items = getInvoiceItems();
    const isPaid = bill.status === 'paid';
    const isPartial = bill.status === 'partial';

    return (
        <div className="fixed inset-0 bg-[#f3f4f6] z-[60] flex flex-col justify-end sm:justify-center items-center animate-in slide-in-from-right duration-300">
            <div className="w-full sm:max-w-md h-full sm:h-[90vh] bg-white sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                <div className="bg-white px-5 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-gray-100"><ArrowLeft size={22} className="text-gray-700"/></button>
                        <h3 className="font-bold text-lg text-gray-900">Invoice Details</h3>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-[#ff4b9a]"><Share2 size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 pb-32 sm:pb-5">
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative">
                        {isPaid && <div className="absolute top-12 right-8 transform rotate-12 border-4 border-green-500 text-green-500 px-4 py-2 rounded-xl text-3xl font-black opacity-20 pointer-events-none">PAID</div>}
                        <div className="bg-[#2d1b4e] p-6 text-white relative overflow-hidden">
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <img src="https://drive.google.com/uc?export=view&id=1xN5yRuuX9czhb0YhCDaa3vij3AKqdezd" alt="Logo" className="h-6 mb-3 opacity-90 brightness-0 invert"/>
                                    <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Invoice ID</p>
                                    <p className="font-mono text-sm">#INV-{bill.id.slice(0,6).toUpperCase()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Billing Month</p>
                                    <p className="font-bold text-sm">{new Date(bill.month).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Billed To</p>
                                <h4 className="font-bold text-gray-900 text-lg leading-tight">{bill.tenant_name}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{bill.asset_name}</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-xs font-bold text-gray-900 uppercase border-b border-gray-100 pb-2">Description</p>
                            <div className="space-y-3">
                                {items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600 font-medium">{item.label}</span>
                                        <span className="font-bold text-gray-900">৳ {item.amount.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t-2 border-dashed border-gray-200 my-4 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                                    <span className="text-xl font-extrabold text-[#ff4b9a]">৳ {bill.total.toLocaleString()}</span>
                                </div>
                                {isPaid && (
                                    <div className="flex justify-between items-center mt-2 text-green-600">
                                        <span className="text-xs font-bold uppercase">Paid on {bill.paid_date ? bill.paid_date.slice(0, 10) : 'Unknown'}</span>
                                        <span className="text-sm font-bold">- ৳ {bill.total.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {!isPaid && (
                    <div className="bg-white p-5 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-bottom shrink-0">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Total Payable</p>
                                <p className="text-xl font-extrabold text-gray-900">৳ {bill.total.toLocaleString()}</p>
                            </div>
                            <button onClick={onPay} className="flex-[1.5] bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                                {isPartial ? 'Collect Remaining' : 'Record Collection'} <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const ChangeStatusModal: React.FC<{ bill: Bill, onClose: () => void }> = ({ bill, onClose }) => {
    const [action, setAction] = useState<'reverse' | 'adjust'>('reverse');
    const [newAmount, setNewAmount] = useState(bill.total);

    const handleUpdate = () => {
         DataService.updateBill(bill.id, { 
             status: action === 'reverse' ? 'unpaid' : 'paid',
             total: action === 'adjust' ? newAmount : bill.total
         });
         onClose();
    };

    return (
        <Modal onClose={onClose} title="Update Status">
            <div className="p-6 pt-2 space-y-4">
                <div onClick={() => setAction('reverse')} className={`p-4 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-colors ${action === 'reverse' ? 'border-gray-800 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${action === 'reverse' ? 'border-gray-800' : 'border-gray-300'}`}>{action === 'reverse' && <div className="w-2.5 h-2.5 bg-gray-800 rounded-full"/>}</div>
                    <div><h5 className="text-sm font-bold text-gray-900">Mark as Unpaid</h5><p className="text-[10px] text-gray-500 leading-tight mt-1">Reverse transaction to due status</p></div>
                </div>
                <div onClick={() => setAction('adjust')} className={`p-4 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-colors ${action === 'adjust' ? 'border-[#ff4b9a] bg-pink-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center ${action === 'adjust' ? 'border-[#ff4b9a]' : 'border-gray-300'}`}>{action === 'adjust' && <div className="w-2.5 h-2.5 bg-[#ff4b9a] rounded-full"/>}</div>
                    <div className="w-full">
                        <h5 className="text-sm font-bold text-gray-900">Adjust Amount</h5>
                        {action === 'adjust' && <input type="number" value={newAmount} onChange={e => setNewAmount(parseInt(e.target.value))} className="w-full mt-2 p-2 text-sm font-bold border border-gray-300 rounded-lg focus:border-[#ff4b9a] focus:outline-none"/>}
                    </div>
                </div>
                <button onClick={handleUpdate} className="w-full py-4 bg-gray-900 text-white rounded-xl text-xs font-bold mt-2 shadow-lg hover:bg-black transition-colors">Confirm Update</button>
            </div>
        </Modal>
    );
};

const PaymentConfirmationModal: React.FC<{ bill: Bill, onClose: () => void }> = ({ bill, onClose }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [payMode, setPayMode] = useState<'total' | 'custom'>('total');
    const [amount, setAmount] = useState(bill.total);
    const [collectionDate, setCollectionDate] = useState(new Date().toISOString().slice(0, 10));
    const [holdProgress, setHoldProgress] = useState(0);
    const intervalRef = React.useRef<any>(null);

    const handleStartHold = () => {
        if (step !== 2) return;
        intervalRef.current = setInterval(() => {
            setHoldProgress(prev => { if (prev >= 100) { clearInterval(intervalRef.current); return 100; } return prev + 4; });
        }, 16);
    };

    const handleEndHold = () => {
        clearInterval(intervalRef.current);
        if (holdProgress < 100) setHoldProgress(0);
        else handleSuccess();
    };

    const handleSuccess = () => {
        setTimeout(() => {
            DataService.updateBill(bill.id, { 
                status: payMode === 'total' ? 'paid' : 'partial',
                total: payMode === 'total' ? bill.total : amount,
                paid_date: new Date(collectionDate).toISOString() 
            });
            onClose();
        }, 500);
    }

    return (
        <Modal onClose={step === 1 ? onClose : () => setStep(1)} title={step === 1 ? 'Record Collection' : 'Verify & Confirm'}>
            <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar p-6">
                {step === 1 ? (
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 text-center shadow-sm">
                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Outstanding</p>
                            <h2 className="text-3xl font-extrabold text-gray-900">৳ {bill.total.toLocaleString()}</h2>
                        </div>
                        <div className="space-y-3">
                            <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${payMode === 'total' ? 'border-[#ff4b9a] bg-white shadow-md' : 'border-gray-200 bg-white'}`}>
                                <div><p className="font-bold text-gray-900">Full Amount</p><p className="text-[10px] text-gray-500">Collect entire due</p></div>
                                <span className="font-extrabold text-lg text-gray-900">৳ {bill.total.toLocaleString()}</span>
                                <input type="radio" className="hidden" checked={payMode === 'total'} onChange={() => { setPayMode('total'); setAmount(bill.total); }} />
                            </label>
                            <label className={`flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all ${payMode === 'custom' ? 'border-[#ff4b9a] bg-white shadow-md' : 'border-gray-200 bg-white'}`}>
                                <div className="flex items-center justify-between w-full mb-3">
                                    <div><p className="font-bold text-gray-900">Partial Amount</p><p className="text-[10px] text-gray-500">Collect specific amount</p></div>
                                    <input type="radio" className="hidden" checked={payMode === 'custom'} onChange={() => setPayMode('custom')} />
                                </div>
                                {payMode === 'custom' && (
                                    <div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-400">৳</span><input type="number" value={amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-xl text-gray-900 focus:outline-none focus:border-[#ff4b9a]" /></div>
                                )}
                            </label>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-900 mb-2">Collection Date</label>
                            <input type="date" value={collectionDate} onChange={(e) => setCollectionDate(e.target.value)} className="w-full px-5 py-3 rounded-xl border border-gray-200 font-bold bg-white text-gray-900 focus:outline-none focus:border-[#ff4b9a]" />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                            <div className="w-24 h-24 bg-pink-50 text-[#ff4b9a] rounded-full flex items-center justify-center mb-2">
                                <FileText size={40} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">You are recording a collection of</p>
                                <h2 className="text-4xl font-extrabold text-gray-900 my-2">৳ {amount.toLocaleString()}</h2>
                                <p className="text-gray-500 text-sm font-medium">from <span className="text-gray-900 font-bold">{bill.tenant_name}</span></p>
                            </div>
                    </div>
                )}
            </div>
            <div className="p-6 bg-white border-t border-gray-100 safe-bottom">
                {step === 1 ? (
                    <button onClick={() => setStep(2)} className="w-full py-4 bg-[#ff4b9a] text-white font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg">Next Step <ArrowRight size={20}/></button>
                ) : (
                    <div 
                        className="relative w-full h-16 bg-[#ff4b9a] rounded-full overflow-hidden flex items-center justify-center cursor-pointer select-none touch-none shadow-xl shadow-pink-200"
                        onMouseDown={handleStartHold} onMouseUp={handleEndHold} onMouseLeave={handleEndHold} onTouchStart={handleStartHold} onTouchEnd={handleEndHold}
                    >
                        <div className="absolute left-0 top-0 bottom-0 bg-[#d63384] transition-all duration-75 ease-linear" style={{ width: `${holdProgress}%` }}></div>
                        <div className="relative z-10 flex items-center gap-3 text-white">
                            {holdProgress >= 100 ? <CheckCircle2 size={32} /> : <span className="font-bold text-sm tracking-widest uppercase">Hold to Record</span>}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

const AddChargesModal: React.FC<{ bill: Bill, onClose: () => void }> = ({ bill, onClose }) => {
    const [charges, setCharges] = useState({ electricity: bill.electricity_bill || 0, gas: bill.gas_bill || 0, others: bill.additional_charges_amount || 0, fuel: bill.fuel_cost || 0, driver: bill.driver_allowance || 0, toll: bill.toll_cost || 0, damage: bill.damage_cost || 0, late: bill.late_fee || 0 });
    const handleSave = () => { DataService.updateBill(bill.id, { electricity_bill: charges.electricity, gas_bill: charges.gas_bill, additional_charges_amount: charges.others, fuel_cost: charges.fuel, driver_allowance: charges.driver, toll_cost: charges.toll, damage_cost: charges.damage, late_fee: charges.late }); onClose(); };
    const InputRow = ({ label, icon: Icon, value, onChange, color = "text-gray-500" }: any) => (
        <div><label className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-2"><Icon size={14} className={color}/> {label}</label><div className="relative"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span><input type="number" value={value || ''} onChange={e => onChange(parseInt(e.target.value))} className="w-full pl-8 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#ff4b9a] text-gray-900 font-bold" placeholder="0"/></div></div>
    );
    return (
        <Modal onClose={onClose} title="Add Charges">
            <div className="p-6 pt-2">
                <div className="space-y-4 mb-6">{bill.asset_type === 'Vehicle' ? (<><InputRow label="Fuel Cost" icon={Fuel} color="text-orange-500" value={charges.fuel} onChange={(v: number) => setCharges({...charges, fuel: v})} /><InputRow label="Driver Allowance" icon={CheckCircle2} color="text-blue-500" value={charges.driver} onChange={(v: number) => setCharges({...charges, driver: v})} /><InputRow label="Toll & Parking" icon={MoreHorizontal} value={charges.toll} onChange={(v: number) => setCharges({...charges, toll: v})} /></>) : bill.asset_type === 'Gadget' ? (<><InputRow label="Damage Repair" icon={Wrench} color="text-red-500" value={charges.damage} onChange={(v: number) => setCharges({...charges, damage: v})} /><InputRow label="Late Return Fee" icon={RefreshCcw} color="text-orange-500" value={charges.late} onChange={(v: number) => setCharges({...charges, late: v})} /></>) : (<><InputRow label="Electricity Bill" icon={Zap} color="text-yellow-500" value={charges.electricity} onChange={(v: number) => setCharges({...charges, electricity: v})} /><InputRow label="Gas Bill" icon={Flame} color="text-orange-500" value={charges.gas} onChange={(v: number) => setCharges({...charges, gas: v})} /><InputRow label="Other Charges" icon={MoreHorizontal} value={charges.others} onChange={(v: number) => setCharges({...charges, others: v})} /></>)}</div><button onClick={handleSave} className="w-full py-4 bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:bg-[#e63e8a] transition-colors"><CheckCircle2 size={18} /> Update Bill</button>
            </div>
        </Modal>
    );
};

export default Payments;
