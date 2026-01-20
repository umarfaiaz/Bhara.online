
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
    <div className="p-6 md:p-8 lg:p-10 space-y-10 pb-32">
      
      {/* Greeting & Quick Summary */}
      <div className="flex justify-between items-end border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t('ms_dashboard')}</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Overview of your business performance</p>
        </div>
        <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('ms_net_revenue')}</p>
            <p className="text-3xl font-black text-[#ff4b9a]">৳ {stats.totalCollected.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        
        {/* Asset Performance Group */}
        <div className="space-y-6 flex flex-col h-full">
            {/* Real Estate Card */}
            <div onClick={() => navigate('/myspace/inventory')} className="flex-1 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative overflow-hidden active:scale-[0.99] transition-all cursor-pointer group">
                <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <Building2 size={120} />
                </div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg">Real Estate</h4>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">{stats.occupiedFlats} / {stats.totalFlats} Occupied</p>
                    </div>
                </div>
                <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden relative z-10">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out" style={{ width: `${stats.totalFlats ? (stats.occupiedFlats/stats.totalFlats)*100 : 0}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Mobility Card */}
                <div onClick={() => navigate('/myspace/inventory')} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer group">
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <Car size={22} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Transport</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{stats.rentedVehicles} / {stats.totalVehicles} Rented</p>
                        </div>
                    </div>
                </div>

                {/* Gadgets Card */}
                <div onClick={() => navigate('/myspace/inventory')} className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer group">
                    <div className="flex flex-col gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Camera size={22} />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900">Equipment</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">{stats.rentedGadgets} / {stats.totalGadgets} Rented</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Financial Health */}
        <div onClick={() => navigate('/myspace/payments')} className="bg-[#2d1b4e] rounded-[2.5rem] p-8 text-white relative overflow-hidden active:scale-[0.99] transition-all hover:shadow-2xl hover:shadow-indigo-900/30 cursor-pointer flex flex-col justify-between group min-h-[300px]">
            {/* Abstract Shapes */}
            <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
            <div className="absolute bottom-[-20px] left-[-20px] w-40 h-40 bg-pink-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-xl tracking-wide">Financial Health</h3>
                    <span className="text-[10px] font-bold uppercase bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">This Month</span>
                </div>
                
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-colors">
                        <p className="text-xs text-gray-300 font-bold uppercase mb-1">Total Due</p>
                        <p className="text-2xl font-black">৳ {totalPossible.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 backdrop-blur-sm">
                        <p className="text-xs text-emerald-300 font-bold uppercase mb-1">Collected</p>
                        <p className="text-2xl font-black text-emerald-400">৳ {stats.totalCollected.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 mt-6 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm text-gray-300">
                    <span className="font-medium">Pending: {stats.pendingBillsCount} Bills</span>
                    <button className="flex items-center gap-2 text-[#ff4b9a] font-bold bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-all">View <ArrowRight size={16}/></button>
                </div>
            </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">{t('ms_quick_actions')}</h3>
            <div className="grid grid-cols-2 gap-4 h-[calc(100%-3rem)] content-start">
            {[
                { label: t('ms_add_asset'), icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50', path: '/myspace/inventory/select-type', desc: 'List new property' },
                { label: t('ms_new_renter'), icon: Users, color: 'text-[#ff4b9a]', bg: 'bg-pink-50', path: '/myspace/renters', desc: 'Assign tenant' },
                { label: t('ms_payments'), icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50', path: '/myspace/payments', desc: 'Track dues' },
                { label: t('ms_manage'), icon: Wrench, color: 'text-blue-600', bg: 'bg-blue-50', path: '/myspace/inventory', desc: 'Maintenance' },
            ].map((action, i) => (
                <button 
                    key={i} 
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-3xl hover:bg-gray-50 transition-all group border border-transparent hover:border-gray-200"
                >
                <div className={`w-16 h-16 rounded-2xl ${action.bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon size={28} className={action.color} />
                </div>
                <div className="text-center">
                    <span className="block text-sm font-bold text-gray-900 leading-tight mb-1">{action.label}</span>
                    <span className="block text-[10px] text-gray-400 font-medium">{action.desc}</span>
                </div>
                </button>
            ))}
            </div>
        </div>

      </div>

    </div>
  );
};

export default Overview;
