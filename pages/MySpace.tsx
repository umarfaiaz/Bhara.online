
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Overview from './MySpace/Overview';
import Renters from './MySpace/Renters';
import Payments from './MySpace/Payments';
import Inventory from './MySpace/Inventory';
import RenterOverview from './MySpace/RenterOverview';
import Maintenance from './MySpace/Maintenance';
import MyRental from './MySpace/MyRental';
import RenterPayments from './MySpace/RenterPayments';
import { Logo } from '../components/Logo';

const MySpace: React.FC = () => {
  const [role, setRole] = useState<'lender' | 'renter'>(() => {
      return (localStorage.getItem('bhara_role') as 'lender' | 'renter') || 'lender';
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('bhara_role', role);
    if (!location.pathname.includes('/overview')) {
        navigate('/myspace/overview');
    }
  }, [role]);

  const lenderTabs = [
    { label: 'Overview', path: '/myspace/overview' },
    { label: 'Renters', path: '/myspace/renters' },
    { label: 'Payments', path: '/myspace/payments' },
    { label: 'Inventory', path: '/myspace/inventory' },
  ];

  const renterTabs = [
      { label: 'Dashboard', path: '/myspace/overview' },
      { label: 'My Rental', path: '/myspace/my-rental' },
      { label: 'Payments', path: '/myspace/payments' },
      { label: 'Issues', path: '/myspace/issues' },
  ];

  const currentTabs = role === 'lender' ? lenderTabs : renterTabs;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* 
          Sub-Header Configuration:
          - Sticky top-0 because the scroll container (main) is already offset by the Layout header height.
          - Z-Index: 40 to slide under the main navigation (z-100) if needed, or sit nicely below it.
      */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm border-b border-gray-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto w-full">
            <div className="px-5 md:px-8 pt-4 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 h-auto md:h-[60px]">
                
                {/* Top Row: Logo/Title + Role Switcher */}
                <div className="flex items-center justify-between md:justify-start gap-6 pb-3 md:pb-0">
                    <div className="flex items-center gap-3">
                        <div className="md:hidden">
                            <Logo size="sm" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden md:block">My Space</h1>
                    </div>

                    {/* Role Toggle - Modern Segmented Control */}
                    <div className="bg-gray-100/80 p-1 rounded-xl flex gap-1 shadow-inner border border-gray-200/50">
                        <button 
                            onClick={() => setRole('lender')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${role === 'lender' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Owner
                        </button>
                        <button 
                            onClick={() => setRole('renter')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${role === 'renter' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Renter
                        </button>
                    </div>
                </div>

                {/* Bottom Row: Navigation Tabs */}
                <div className="flex gap-6 overflow-x-auto scrollbar-hide pt-1 self-end">
                    {currentTabs.map((tab) => {
                        const isActive = location.pathname.startsWith(tab.path);
                        return (
                        <NavLink
                            key={tab.label}
                            to={tab.path}
                            className={`pb-3 text-sm font-bold transition-all border-b-[3px] whitespace-nowrap px-1 ${
                            isActive ? 'text-[#ff4b9a] border-[#ff4b9a]' : 'text-gray-400 border-transparent hover:text-gray-600 hover:border-gray-200'
                            }`}
                        >
                            {tab.label}
                        </NavLink>
                        );
                    })}
                </div>
            </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto w-full">
            <Routes>
            {role === 'lender' ? (
                <>
                    <Route path="overview" element={<Overview />} />
                    <Route path="renters/*" element={<Renters />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="inventory/*" element={<Inventory />} />
                </>
            ) : (
                <>
                    <Route path="overview" element={<RenterOverview />} />
                    <Route path="my-rental" element={<MyRental />} />
                    <Route path="payments" element={<RenterPayments />} />
                    <Route path="issues" element={<Maintenance />} />
                </>
            )}
            </Routes>
        </div>
      </div>
    </div>
  );
};

export default MySpace;
