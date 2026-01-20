
import React, { useEffect, useState } from 'react';
import { Building2, Users, Receipt, Wrench, Send, Car, Camera, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../../services/mockData';
import { useLanguage } from '../../contexts/LanguageContext';

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [stats, setStats] = useState(DataService.getStats());

  useEffect(() => {
    const interval = setInterval(() => {
        setStats(DataService.getStats());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalPossible = stats.totalCollected + stats.totalPending;
  const collectedPercentage = totalPossible > 0 ? (stats.totalCollected / totalPossible) * 100 : 0;

  return (
    <div className="p-6 space-y-8 pb-32">
      
      {/* Greeting & Quick Summary */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('ms_dashboard')}</h2>
          <p className="text-xs text-gray-500 font-medium">Business Performance</p>
        </div>
        <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">{t('ms_net_revenue')}</p>
            <p className="text-xl font-extrabold text-[#ff4b9a]">৳ {stats.totalCollected.toLocaleString()}</p>
        </div>
      </div>

      {/* Asset Performance Grid */}
      <div className="grid grid-cols-1 gap-4">
          
          {/* Real Estate Card */}
          <div onClick={() => navigate('/myspace/inventory')} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer">
              <div className="absolute right-0 top-0 p-4 opacity-5">
                  <Building2 size={80} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Building2 size={20} />
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-900">Real Estate</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">{stats.occupiedFlats} / {stats.totalFlats} Occupied</p>
                  </div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.totalFlats ? (stats.occupiedFlats/stats.totalFlats)*100 : 0}%` }}></div>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Mobility Card */}
             <div onClick={() => navigate('/myspace/inventory')} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
                <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Car size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Transport</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{stats.rentedVehicles} / {stats.totalVehicles} Rented</p>
                    </div>
                </div>
             </div>

             {/* Gadgets Card */}
             <div onClick={() => navigate('/myspace/inventory')} className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
                <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                        <Camera size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Equipment</h4>
                        <p className="text-[10px] text-gray-500 font-bold uppercase">{stats.rentedGadgets} / {stats.totalGadgets} Rented</p>
                    </div>
                </div>
             </div>
          </div>
      </div>

      {/* Financial Health */}
      <div onClick={() => navigate('/myspace/payments')} className="bg-[#2d1b4e] rounded-[2rem] p-6 text-white relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer shadow-lg shadow-indigo-900/20">
          <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg">Financial Health</h3>
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded-lg">This Month</span>
              </div>
              
              <div className="flex gap-4">
                  <div className="flex-1 p-3 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-[10px] text-gray-300 mb-1">Total Due</p>
                      <p className="text-lg font-bold">৳ {totalPossible.toLocaleString()}</p>
                  </div>
                  <div className="flex-1 p-3 bg-green-500/20 rounded-2xl border border-green-500/30">
                      <p className="text-[10px] text-green-300 mb-1">Collected</p>
                      <p className="text-lg font-bold text-green-400">৳ {stats.totalCollected.toLocaleString()}</p>
                  </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-gray-300">
                  <span>Pending Requests: {stats.pendingBillsCount}</span>
                  <button className="flex items-center gap-1 text-[#ff4b9a] font-bold">View <ArrowRight size={14}/></button>
              </div>
          </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-4 px-1">{t('ms_quick_actions')}</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { label: t('ms_add_asset'), icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50', path: '/myspace/inventory/select-type' },
            { label: t('ms_new_renter'), icon: Users, color: 'text-[#ff4b9a]', bg: 'bg-pink-50', path: '/myspace/renters' },
            { label: t('ms_payments'), icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50', path: '/myspace/payments' },
            { label: t('ms_manage'), icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50', path: '/myspace/inventory' },
          ].map((action, i) => (
            <button 
                key={i} 
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center gap-3 min-w-[80px] group"
            >
              <div className={`w-16 h-16 rounded-3xl ${action.bg} flex items-center justify-center shadow-sm group-active:scale-95 transition-transform`}>
                <action.icon size={26} className={action.color} />
              </div>
              <span className="text-[11px] font-bold text-gray-600 text-center leading-tight">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Overview;
