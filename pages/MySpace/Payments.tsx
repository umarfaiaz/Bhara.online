
import React, { useState, useEffect } from 'react';
import { ChevronDown, Send, CheckCircle2, MoreHorizontal, Info, ChevronRight, X, Zap, Droplets, Flame, RefreshCcw, Edit3, Trash2, Fuel, PenTool, Wrench, Camera, Car, Home, ArrowLeft, ArrowRight, Share2, Download, Printer, Calendar, Filter, PlusCircle, Building2, AlertTriangle, FileText, CheckSquare, Square, Plus } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { Bill, AssetType } from '../../types';
import { Logo } from '../../components/Logo';

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

  // --- Render Modals ---

  const AddChargeModal = () => {
      if (!showAddCharges) return null;
      const [charges, setCharges] = useState({
          gas: showAddCharges.gas_bill,
          water: showAddCharges.water_bill,
          electricity: showAddCharges.electricity_bill || 0,
          other: showAddCharges.other_bills || 0,
          fuel: showAddCharges.fuel_cost || 0,
          toll: showAddCharges.toll_cost || 0
      });

      const handleSave = () => {
          DataService.updateBill(showAddCharges.id, {
              gas_bill: charges.gas,
              water_bill: charges.water,
              electricity_bill: charges.electricity,
              other_bills: charges.other,
              fuel_cost: charges.fuel,
              toll_cost: charges.toll
          });
          setShowAddCharges(null);
          refreshData();
      };

      return (
          <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-6 backdrop-blur-sm">
              <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Add Charges</h3>
                      <button onClick={() => setShowAddCharges(null)} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                  </div>
                  <div className="space-y-4">
                      {showAddCharges.asset_type === 'Residential' && (
                          <>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Electricity Bill</label><input type="number" value={charges.electricity} onChange={e => setCharges({...charges, electricity: parseInt(e.target.value) || 0})} className="w-full bg-gray-50 p-3 rounded-xl font-bold" /></div>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Gas Bill</label><input type="number" value={charges.gas} onChange={e => setCharges({...charges, gas: parseInt(e.target.value) || 0})} className="w-full bg-gray-50 p-3 rounded-xl font-bold" /></div>
                          </>
                      )}
                      {showAddCharges.asset_type === 'Vehicle' && (
                           <>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Fuel Cost</label><input type="number" value={charges.fuel} onChange={e => setCharges({...charges, fuel: parseInt(e.target.value) || 0})} className="w-full bg-gray-50 p-3 rounded-xl font-bold" /></div>
                            <div><label className="text-xs font-bold text-gray-500 mb-1 block">Toll / Parking</label><input type="number" value={charges.toll} onChange={e => setCharges({...charges, toll: parseInt(e.target.value) || 0})} className="w-full bg-gray-50 p-3 rounded-xl font-bold" /></div>
                           </>
                      )}
                      <div><label className="text-xs font-bold text-gray-500 mb-1 block">Other / Late Fee</label><input type="number" value={charges.other} onChange={e => setCharges({...charges, other: parseInt(e.target.value) || 0})} className="w-full bg-gray-50 p-3 rounded-xl font-bold" /></div>
                  </div>
                  <button onClick={handleSave} className="w-full mt-6 py-3 bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg">Update Bill</button>
              </div>
          </div>
      );
  };

  const InvoiceModal = () => {
      if (!viewBill) return null;
      return (
          <div className="fixed inset-0 bg-black/80 z-[80] flex flex-col items-center justify-center p-4 backdrop-blur-md">
              <div className="bg-white w-full max-w-sm rounded-[1.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
                  {/* Invoice Header */}
                  <div className="bg-[#2d1b4e] p-6 text-white text-center relative">
                      <button onClick={() => setViewBill(null)} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20"><X size={20}/></button>
                      <div className="mb-3 flex justify-center scale-90"><Logo light size="sm"/></div>
                      <h2 className="text-xl font-bold mb-1">Invoice Receipt</h2>
                      <p className="text-xs opacity-70">#{viewBill.id.slice(-6).toUpperCase()}</p>
                  </div>
                  
                  <div className="p-6 relative">
                       {/* Dashed Line */}
                       <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-gray-200"></div>
                       <div className="absolute top-[-10px] left-[-10px] w-5 h-5 bg-[#2d1b4e] rounded-full"></div>
                       <div className="absolute top-[-10px] right-[-10px] w-5 h-5 bg-[#2d1b4e] rounded-full"></div>

                       <div className="text-center mb-6 mt-2">
                           <h3 className="text-2xl font-extrabold text-gray-900">৳ {viewBill.total.toLocaleString()}</h3>
                           <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase mt-2 ${viewBill.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-600'}`}>
                               {viewBill.status === 'paid' ? 'Paid Successfully' : 'Payment Pending'}
                           </span>
                       </div>

                       <div className="space-y-3 mb-6">
                           <div className="flex justify-between text-sm"><span className="text-gray-500">Billed To</span><span className="font-bold text-gray-900">{viewBill.tenant_name}</span></div>
                           <div className="flex justify-between text-sm"><span className="text-gray-500">Asset</span><span className="font-bold text-gray-900">{viewBill.asset_name}</span></div>
                           <div className="flex justify-between text-sm"><span className="text-gray-500">Month</span><span className="font-bold text-gray-900">{new Date(viewBill.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></div>
                       </div>

                       <div className="bg-gray-50 rounded-xl p-4 space-y-2 mb-6">
                           <div className="flex justify-between text-xs"><span className="text-gray-500">Base Rent</span><span className="font-bold">৳ {viewBill.rent_amount}</span></div>
                           {viewBill.service_charge > 0 && <div className="flex justify-between text-xs"><span className="text-gray-500">Service Charge</span><span className="font-bold">৳ {viewBill.service_charge}</span></div>}
                           {(viewBill.gas_bill > 0 || viewBill.water_bill > 0) && <div className="flex justify-between text-xs"><span className="text-gray-500">Utility (Gas/Water)</span><span className="font-bold">৳ {viewBill.gas_bill + viewBill.water_bill}</span></div>}
                           {viewBill.electricity_bill! > 0 && <div className="flex justify-between text-xs"><span className="text-gray-500">Electricity</span><span className="font-bold">৳ {viewBill.electricity_bill}</span></div>}
                           <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-sm text-gray-900"><span>Total</span><span>৳ {viewBill.total.toLocaleString()}</span></div>
                       </div>

                       <div className="flex gap-3">
                           <button className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50"><Share2 size={16}/> Share</button>
                           <button className="flex-1 py-3 bg-[#2d1b4e] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"><Download size={16}/> PDF</button>
                       </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="p-5 space-y-6 max-w-lg mx-auto bg-gray-50 min-h-screen">
      
      {/* 1. Header Card - Hidden in Selection Mode */}
      {!isSelectionMode && (
          <div className="bg-[#2d1b4e] rounded-3xl p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden transition-all duration-300 transform">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
             <div className="relative z-10">
                 <div className="flex justify-between items-start mb-4">
                     <div>
                         <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Collections</p>
                         <h2 className="text-3xl font-extrabold">৳ {stats.totalCollected.toLocaleString()}</h2>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                         <Zap className="text-yellow-300" size={20} fill="currentColor"/>
                     </div>
                 </div>
                 
                 <div className="bg-black/20 rounded-xl p-3 flex items-center justify-between mb-2">
                     <span className="text-xs font-medium text-indigo-100">Pending Dues</span>
                     <span className="text-sm font-bold text-white">৳ {stats.totalPending.toLocaleString()}</span>
                 </div>

                 {/* Progress Bar */}
                 <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-[#ff4b9a] to-pink-400" style={{ width: `${progressPercent}%` }}></div>
                 </div>
                 <p className="text-[10px] text-right mt-1 text-indigo-300">{Math.round(progressPercent)}% Collected</p>
             </div>
          </div>
      )}

      {/* 2. Controls & Filter */}
      <div className="flex justify-between items-center sticky top-0 bg-gray-50 py-2 z-10 backdrop-blur-sm">
           {isSelectionMode ? (
               <div className="flex items-center gap-3 w-full bg-white p-2 pr-3 rounded-xl shadow-sm border border-gray-200 animate-in slide-in-from-top">
                   <button onClick={toggleSelectionMode} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20}/></button>
                   <span className="font-bold text-sm flex-1">{selectedBillIds.size} Selected</span>
                   <button onClick={selectAll} className="text-xs font-bold text-[#ff4b9a] px-3">All</button>
                   {selectedBillIds.size > 0 && (
                       <button onClick={handleBulkUpdate} className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-md hover:bg-green-700">Mark Paid</button>
                   )}
               </div>
           ) : (
               <>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>All</button>
                    <button onClick={() => setFilter('due')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'due' ? 'bg-red-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Due</button>
                    <button onClick={() => setFilter('paid')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === 'paid' ? 'bg-green-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>Paid</button>
                </div>
                <button onClick={toggleSelectionMode} className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 shadow-sm hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-all">
                    <CheckSquare size={20} />
                </button>
               </>
           )}
      </div>

      {/* 3. Bills List */}
      <div className="space-y-3 pb-20">
          {filteredBills.map(bill => (
              <div 
                key={bill.id} 
                onClick={() => isSelectionMode ? toggleSelection(bill.id) : setViewBill(bill)}
                className={`bg-white p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    isSelectionMode && selectedBillIds.has(bill.id) ? 'border-[#ff4b9a] ring-1 ring-[#ff4b9a] bg-pink-50/50' : 'border-gray-100 hover:border-gray-200 shadow-sm'
                }`}
              >
                  <div className="flex items-center gap-4">
                      {/* Icon / Checkbox */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                          isSelectionMode && selectedBillIds.has(bill.id) ? 'bg-[#ff4b9a] text-white' : 'bg-gray-50'
                      }`}>
                          {isSelectionMode ? (
                              selectedBillIds.has(bill.id) ? <CheckCircle2 size={24}/> : <Square size={24} className="text-gray-300"/>
                          ) : (
                              getAssetIcon(bill.asset_type)
                          )}
                      </div>

                      <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{bill.tenant_name}</h4>
                          <p className="text-xs text-gray-500 truncate">{bill.asset_name} • {new Date(bill.month).toLocaleDateString('en-US', { month: 'short' })}</p>
                      </div>

                      <div className="text-right">
                          <h4 className="font-extrabold text-gray-900">৳ {bill.total.toLocaleString()}</h4>
                          {bill.status === 'unpaid' ? (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setShowAddCharges(bill); }}
                                className="mt-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1 ml-auto hover:bg-blue-100"
                              >
                                  <Plus size={10}/> Add Charge
                              </button>
                          ) : (
                              <span className="mt-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded inline-block">Paid</span>
                          )}
                      </div>
                  </div>
              </div>
          ))}
          
          {filteredBills.length === 0 && (
              <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <FileText size={32}/>
                  </div>
                  <p className="text-gray-400 font-medium text-sm">No bills found.</p>
              </div>
          )}
      </div>

      {/* 4. Modals */}
      {showAddCharges && <AddChargeModal />}
      {viewBill && <InvoiceModal />}

    </div>
  );
};

export default Payments;
