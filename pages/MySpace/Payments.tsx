
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, MoreVertical, 
  X, Plus, Home, Car, Camera, Briefcase, Bell, Check, 
  Filter, FileText, Download, Share2, Calendar, Square, CheckSquare, Trash2,
  Edit2, RefreshCcw, DollarSign, AlertCircle
} from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Bill, AssetType, BillCharge } from '../../types';
import { Logo } from '../../components/Logo';

const Payments: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<'All' | 'Due' | 'Paid'>('All');
  const [assetFilter, setAssetFilter] = useState<'All' | AssetType>('All');
  
  const [bills, setBills] = useState<Bill[]>([]);
  const [stats, setStats] = useState({ collected: 0, pending: 0, paidCount: 0, totalCount: 0 });
  
  // Selection
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals
  const [showAddChargeModal, setShowAddChargeModal] = useState<Bill | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<Bill | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Bill | null>(null);
  const [showEditStatusModal, setShowEditStatusModal] = useState<Bill | null>(null);

  const refreshData = () => {
    const allBills = DataService.getBills();
    // Filter by month (Mock logic: just use all for demo or match year/month)
    const monthBills = allBills.filter(b => {
        const d = new Date(b.month);
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

    setBills(monthBills);
    
    // Calculate Stats
    const collected = monthBills.filter(b => b.status === 'paid').reduce((acc, curr) => acc + curr.total, 0);
    const pending = monthBills.filter(b => b.status === 'unpaid').reduce((acc, curr) => acc + curr.total, 0);
    setStats({
        collected,
        pending,
        paidCount: monthBills.filter(b => b.status === 'paid').length,
        totalCount: monthBills.length
    });
  };

  useEffect(() => {
    refreshData();
  }, [currentDate, showEditStatusModal, showConfirmModal, showAddChargeModal]); // Refresh when modals close

  // Derived Filtered List
  const filteredBills = bills.filter(b => {
      const statusMatch = statusFilter === 'All' || 
                          (statusFilter === 'Due' && b.status === 'unpaid') || 
                          (statusFilter === 'Paid' && b.status === 'paid');
      const assetMatch = assetFilter === 'All' || b.asset_type === assetFilter;
      return statusMatch && assetMatch;
  });

  const progress = stats.totalCount > 0 ? (stats.paidCount / stats.totalCount) * 100 : 0;
  const totalPossible = stats.collected + stats.pending;

  // Month Navigation
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));

  // Selection Logic
  const toggleSelection = (id: string) => {
      const newSet = new Set(selectedIds);
      if(newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedIds(newSet);
  };

  const getAssetIcon = (type: AssetType) => {
      switch(type) {
          case 'Vehicle': return <Car size={18} className="text-indigo-600"/>;
          case 'Gadget': return <Camera size={18} className="text-orange-600"/>;
          case 'Residential': return <Home size={18} className="text-blue-600"/>;
          default: return <Briefcase size={18} className="text-gray-600"/>;
      }
  };

  // --- Modals ---
  
  // 1. Add Charges Modal
  const AddChargeModal = () => {
      if(!showAddChargeModal) return null;
      const [name, setName] = useState('Utility');
      const [amount, setAmount] = useState('');
      const [note, setNote] = useState('');

      const handleSave = () => {
          if(!amount) return;
          const currentExtra = showAddChargeModal.extra_charges || [];
          const newCharges = [...currentExtra, { name, amount: parseFloat(amount), note }];
          
          DataService.updateBill(showAddChargeModal.id, { extra_charges: newCharges });
          refreshData();
          setShowAddChargeModal(null);
      };

      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Add Extra Charge</h3>
                      <button onClick={() => setShowAddChargeModal(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-1 block">Charge Name</label>
                          <select value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border border-gray-100 focus:border-[#ff4b9a]">
                              <option>Utility</option>
                              <option>Parking</option>
                              <option>Gas</option>
                              <option>Water</option>
                              <option>Late Fee</option>
                              <option>Garbage Collection</option>
                              <option>Custom</option>
                          </select>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-1 block">Amount (৳)</label>
                          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border border-gray-100 focus:border-[#ff4b9a]" placeholder="0.00"/>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-1 block">Note (Optional)</label>
                          <textarea value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border border-gray-100 focus:border-[#ff4b9a]" rows={2} placeholder="Reason..."/>
                      </div>
                      <button onClick={handleSave} className="w-full mt-2 py-3 bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">Add to Bill</button>
                  </div>
              </div>
          </div>
      );
  };

  // 2. Confirm Payment Modal
  const ConfirmPaymentModal = () => {
      if(!showConfirmModal) return null;
      const [method, setMethod] = useState('Cash');
      const [amount, setAmount] = useState(showConfirmModal.total.toString());
      const [note, setNote] = useState('');

      const handleConfirm = () => {
          DataService.updateBill(showConfirmModal.id, { 
              status: 'paid', 
              paid_date: new Date().toISOString(),
              paid_method: method,
              paid_note: note
          });
          refreshData();
          setShowConfirmModal(null);
      };

      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Confirm Payment</h3>
                      <button onClick={() => setShowConfirmModal(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl mb-4 text-center">
                      <p className="text-xs text-gray-500 font-bold uppercase">Total Due</p>
                      <h2 className="text-3xl font-extrabold text-gray-900">৳ {showConfirmModal.total.toLocaleString()}</h2>
                  </div>
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                          {['Cash', 'bKash', 'Nagad', 'Bank'].map(m => (
                              <button key={m} onClick={() => setMethod(m)} className={`py-2 rounded-xl text-xs font-bold border transition-all ${method === m ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200'}`}>
                                  {m}
                              </button>
                          ))}
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-1 block">Received Amount</label>
                          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border border-gray-200 focus:border-green-500" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-1 block">Note</label>
                          <input type="text" value={note} onChange={e => setNote(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none border border-gray-200 focus:border-green-500" placeholder="Reference ID..."/>
                      </div>
                      <button onClick={handleConfirm} className="w-full mt-2 py-3 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 transition-all">Mark as Paid</button>
                  </div>
              </div>
          </div>
      );
  };

  // 3. Edit Status Modal (New Feature)
  const EditStatusModal = () => {
      if(!showEditStatusModal) return null;
      const [newStatus, setNewStatus] = useState<'unpaid' | 'paid' | 'partial'>(showEditStatusModal.status);
      const [newTotal, setNewTotal] = useState(showEditStatusModal.total.toString());

      const handleUpdate = () => {
          const payload: Partial<Bill> = {
              status: newStatus,
              total: parseFloat(newTotal)
          };
          
          if (newStatus === 'unpaid') {
              payload.paid_date = undefined; // Clear paid date if moving back to unpaid
              payload.paid_method = undefined;
          } else if (newStatus === 'paid' && !showEditStatusModal.paid_date) {
              payload.paid_date = new Date().toISOString();
          }

          DataService.updateBill(showEditStatusModal.id, payload);
          refreshData();
          setShowEditStatusModal(null);
      };

      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><Edit2 size={18}/> Modify Invoice</h3>
                      <button onClick={() => setShowEditStatusModal(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-5">
                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Payment Status</label>
                          <div className="flex bg-gray-100 p-1 rounded-xl">
                              {['unpaid', 'paid'].map((s) => (
                                  <button 
                                    key={s} 
                                    onClick={() => setNewStatus(s as any)} 
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${newStatus === s ? (s === 'paid' ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-red-100 text-red-700 shadow-sm') : 'text-gray-500 hover:text-gray-700'}`}
                                  >
                                      {s === 'unpaid' ? 'Due' : 'Paid'}
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Total Amount (Override)</label>
                          <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                              <input 
                                type="number" 
                                value={newTotal} 
                                onChange={e => setNewTotal(e.target.value)} 
                                className="w-full pl-8 pr-4 py-3 bg-gray-50 rounded-xl font-bold outline-none border border-gray-200 focus:border-[#ff4b9a]"
                              />
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><AlertCircle size={10}/> Changing this overrides calculated totals.</p>
                      </div>

                      <button onClick={handleUpdate} className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition-all">
                          Update Invoice
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  // 4. Invoice Details Modal
  const InvoiceDetailsModal = () => {
    if(!viewInvoice) return null;
    return (
        <div className="fixed inset-0 bg-black/80 z-[80] flex flex-col items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-white w-full max-w-sm rounded-[1.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="bg-[#2d1b4e] p-6 text-white text-center relative">
                    <button onClick={() => setViewInvoice(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                    <div className="mb-3 flex justify-center scale-90"><Logo light size="sm"/></div>
                    <h2 className="text-xl font-bold mb-1">Invoice Details</h2>
                    <p className="text-xs opacity-70">#{viewInvoice.id.slice(-6).toUpperCase()}</p>
                </div>
                
                <div className="p-6 relative max-h-[60vh] overflow-y-auto custom-scrollbar">
                     <div className="text-center mb-6 mt-2">
                         <h3 className="text-2xl font-extrabold text-gray-900">৳ {viewInvoice.total.toLocaleString()}</h3>
                         <div className="flex justify-center gap-2 mt-2">
                            <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${viewInvoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                {viewInvoice.status === 'paid' ? 'Paid' : 'Payment Due'}
                            </span>
                            <button onClick={() => { setViewInvoice(null); setShowEditStatusModal(viewInvoice); }} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold hover:bg-gray-200 flex items-center gap-1">
                                <Edit2 size={10}/> Change Status
                            </button>
                         </div>
                     </div>

                     <div className="space-y-3 mb-6 border-b border-gray-100 pb-4">
                         <div className="flex justify-between text-sm"><span className="text-gray-500">Renter</span><span className="font-bold text-gray-900">{viewInvoice.tenant_name}</span></div>
                         <div className="flex justify-between text-sm"><span className="text-gray-500">Asset</span><span className="font-bold text-gray-900">{viewInvoice.asset_name}</span></div>
                         <div className="flex justify-between text-sm"><span className="text-gray-500">Month</span><span className="font-bold text-gray-900">{new Date(viewInvoice.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div>
                     </div>

                     <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Breakdown</h4>
                     <div className="space-y-2 mb-6">
                         <div className="flex justify-between text-xs"><span className="text-gray-600">Base Rent</span><span className="font-bold">৳ {viewInvoice.rent_amount}</span></div>
                         {viewInvoice.service_charge > 0 && <div className="flex justify-between text-xs"><span className="text-gray-600">Service Charge</span><span className="font-bold">৳ {viewInvoice.service_charge}</span></div>}
                         {viewInvoice.electricity_bill! > 0 && <div className="flex justify-between text-xs"><span className="text-gray-600">Electricity</span><span className="font-bold">৳ {viewInvoice.electricity_bill}</span></div>}
                         {(viewInvoice.gas_bill > 0 || viewInvoice.water_bill > 0) && <div className="flex justify-between text-xs"><span className="text-gray-600">Utility</span><span className="font-bold">৳ {viewInvoice.gas_bill + viewInvoice.water_bill}</span></div>}
                         
                         {viewInvoice.extra_charges?.map((c, i) => (
                             <div key={i} className="flex justify-between text-xs bg-gray-50 p-1.5 rounded"><span className="text-gray-600">{c.name}</span><span className="font-bold">৳ {c.amount}</span></div>
                         ))}
                         
                         <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-sm text-gray-900"><span>Total</span><span>৳ {viewInvoice.total.toLocaleString()}</span></div>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                         {viewInvoice.status === 'unpaid' ? (
                             <>
                                <button onClick={() => { setViewInvoice(null); setShowAddChargeModal(viewInvoice); }} className="py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 text-xs">Add Charge</button>
                                <button onClick={() => { setViewInvoice(null); setShowConfirmModal(viewInvoice); }} className="py-3 bg-green-600 text-white rounded-xl font-bold text-xs shadow-lg">Confirm Pay</button>
                             </>
                         ) : (
                             <button className="col-span-2 py-3 bg-[#2d1b4e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Download size={16}/> Download PDF</button>
                         )}
                     </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="p-6 pb-32 space-y-6 max-w-2xl mx-auto">
      
      {/* 1. Month Selector & Summary */}
      <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
          <div className="flex justify-between items-center mb-6">
               <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-50 transition-colors"><ChevronLeft size={20} className="text-gray-400"/></button>
               <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                   <Calendar size={18} className="text-[#ff4b9a]"/>
                   {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
               </h2>
               <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-50 transition-colors"><ChevronRight size={20} className="text-gray-400"/></button>
          </div>

          <div className="flex items-end justify-between mb-4">
              <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Collected</p>
                  <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-extrabold text-blue-600">৳ {stats.collected.toLocaleString()}</h3>
                      <span className="text-xs text-gray-400 font-medium">/ ৳{totalPossible.toLocaleString()}</span>
                  </div>
              </div>
              <div className="text-right">
                  <span className="text-xs font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">{stats.paidCount}/{stats.totalCount} Renters Paid</span>
              </div>
          </div>

          {/* Progress Bar: Blue (Collected) / Pink (Pending) */}
          <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden flex relative">
              <div className="h-full bg-blue-500 transition-all duration-700 relative z-10" style={{ width: `${progress}%` }}></div>
              {/* Pattern overlay for style */}
              <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#000_5px,#000_10px)]"></div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-bold uppercase">
              <span className="text-blue-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Collected</span>
              <span className="text-pink-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-300"></span> Pending</span>
          </div>
      </div>

      {/* 2. Filters & Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-center sticky top-0 bg-gray-50 py-2 z-20 backdrop-blur-sm">
          {isSelectionMode ? (
              <div className="w-full bg-white p-3 rounded-2xl shadow-sm border border-[#ff4b9a] flex items-center gap-3 animate-in slide-in-from-top">
                  <button onClick={() => { setIsSelectionMode(false); setSelectedIds(new Set()); }} className="p-1 rounded-full hover:bg-gray-100"><X size={20}/></button>
                  <span className="font-bold text-sm flex-1">{selectedIds.size} Selected</span>
                  <button className="bg-[#2d1b4e] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"><Bell size={14}/> Notify</button>
              </div>
          ) : (
              <>
                <button onClick={() => setIsSelectionMode(true)} className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#ff4b9a] hover:border-[#ff4b9a] transition-all">
                    <CheckSquare size={20} />
                </button>
                <div className="flex-1 w-full bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex overflow-hidden">
                    {['All', 'Due', 'Paid'].map(s => (
                        <button key={s} onClick={() => setStatusFilter(s as any)} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${statusFilter === s ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}>
                            {s}
                        </button>
                    ))}
                </div>
                <div className="w-full sm:w-auto">
                    <select value={assetFilter} onChange={e => setAssetFilter(e.target.value as any)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-[#ff4b9a]">
                        <option value="All">All Assets</option>
                        <option value="Residential">Flats</option>
                        <option value="Vehicle">Vehicles</option>
                        <option value="Gadget">Gadgets</option>
                    </select>
                </div>
              </>
          )}
      </div>

      {/* 3. Bills List */}
      <div className="space-y-4">
          {filteredBills.map(bill => (
              <div 
                key={bill.id} 
                className={`bg-white p-5 rounded-3xl border transition-all duration-200 relative group ${
                    isSelectionMode && selectedIds.has(bill.id) ? 'border-[#ff4b9a] bg-pink-50/30' : 'border-gray-100 shadow-sm hover:shadow-md'
                }`}
              >
                  <div className="flex gap-4">
                      {/* Checkbox / Icon Column */}
                      <div className="pt-1">
                          {isSelectionMode ? (
                              <button onClick={() => toggleSelection(bill.id)}>
                                  {selectedIds.has(bill.id) ? <CheckCircle2 size={24} className="text-[#ff4b9a] fill-white"/> : <Square size={24} className="text-gray-300"/>}
                              </button>
                          ) : (
                              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
                                  {getAssetIcon(bill.asset_type)}
                              </div>
                          )}
                      </div>

                      {/* Info Column */}
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-gray-900 truncate">{bill.tenant_name}</h4>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${bill.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                                  {bill.status === 'paid' ? 'Paid' : 'Due'}
                              </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{bill.asset_name} • {bill.asset_sub}</p>
                          
                          <div className="flex items-end justify-between mt-2">
                              <div>
                                   <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Amount</p>
                                   <p className={`text-xl font-black ${bill.status === 'unpaid' ? 'text-red-500' : 'text-gray-900'}`}>৳ {bill.total.toLocaleString()}</p>
                              </div>
                              
                              {/* Action Buttons */}
                              {!isSelectionMode && (
                                  <div className="flex items-center gap-2">
                                      {bill.status === 'unpaid' ? (
                                          <>
                                            <button onClick={() => setShowAddChargeModal(bill)} className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors" title="Add Charges">
                                                <Plus size={16}/>
                                            </button>
                                            <button onClick={() => setShowConfirmModal(bill)} className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-600 hover:text-white transition-colors" title="Confirm Payment">
                                                <Check size={16}/>
                                            </button>
                                          </>
                                      ) : (
                                          // Edit Status Button for Paid Bills (Revert to Due)
                                          <button onClick={() => setShowEditStatusModal(bill)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors" title="Change Status">
                                              <RefreshCcw size={16}/>
                                          </button>
                                      )}
                                      
                                      <button onClick={() => setViewInvoice(bill)} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900" title="View Details">
                                          <ChevronRight size={18}/>
                                      </button>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          ))}

          {filteredBills.length === 0 && (
              <div className="text-center py-12">
                  <FileText size={48} className="mx-auto text-gray-200 mb-4"/>
                  <p className="text-gray-400 font-medium">No bills found for this period.</p>
              </div>
          )}
      </div>

      {/* Render Modals */}
      {showAddChargeModal && <AddChargeModal />}
      {showConfirmModal && <ConfirmPaymentModal />}
      {showEditStatusModal && <EditStatusModal />}
      {viewInvoice && <InvoiceDetailsModal />}

    </div>
  );
};

export default Payments;
