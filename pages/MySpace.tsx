
import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Overview from './MySpace/Overview';
import Renters from './MySpace/Renters';
import Payments from './MySpace/Payments';
import Inventory from './MySpace/Inventory';
import { Logo } from '../components/Logo';

const MySpace: React.FC = () => {
  const [role, setRole] = useState<'lender' | 'renter'>('lender');
  const location = useLocation();

  const tabs = [
    { label: 'Overview', path: '/myspace/overview' },
    { label: 'Renters', path: '/myspace/renters' },
    { label: 'Payments', path: '/myspace/payments' },
    { label: 'Inventory', path: '/myspace/inventory' },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <header className="px-6 pt-8 pb-0 bg-white sticky top-0 z-40 shadow-sm border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-gray-300 text-lg font-light">|</span>
            <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">My Space</span>
          </div>

          {/* Toggle Role */}
          <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
            <button 
              onClick={() => setRole('lender')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${role === 'lender' ? 'bg-white text-[#2d1b4e] shadow-sm border border-gray-200' : 'text-gray-400'}`}
            >
              Owner
            </button>
            <button 
              onClick={() => {}} 
              className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${role === 'renter' ? 'bg-white text-[#2d1b4e] shadow-sm' : 'text-gray-400'}`}
            >
              Renter
            </button>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide -mb-[1px]">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <NavLink
                key={tab.label}
                to={tab.path}
                className={`pb-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                  isActive ? 'text-[#ff4b9a] border-[#ff4b9a]' : 'text-gray-400 border-transparent hover:text-gray-600'
                }`}
              >
                {tab.label}
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-x-hidden">
        <Routes>
          <Route path="overview" element={<Overview />} />
          <Route path="renters/*" element={<Renters />} />
          <Route path="payments" element={<Payments />} />
          <Route path="inventory/*" element={<Inventory />} />
        </Routes>
      </div>
    </div>
  );
};

export default MySpace;
