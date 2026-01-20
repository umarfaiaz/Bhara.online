
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, LayoutDashboard, Mail, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t('nav_home'), path: '/home', icon: Home },
    { label: t('nav_marketplace'), path: '/marketplace', icon: ShoppingBag },
    { label: t('nav_myspace'), path: '/myspace/overview', icon: LayoutDashboard },
    { label: t('nav_inbox'), path: '/inbox', icon: Mail },
    { label: t('nav_profile'), path: '/profile', icon: User },
  ];

  const getIsActive = (itemPath: string, currentPath: string) => {
      // Special case for myspace sub-routes
      if (itemPath.includes('myspace')) {
          return currentPath.startsWith('/myspace');
      }
      // Exact match for root-like paths (home) or startsWith for nested (marketplace)
      if (itemPath === '/home') return currentPath === '/home';
      return currentPath.startsWith(itemPath);
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-[#f8f9fa]">
      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar pb-28">
        {children}
      </main>

      {/* Modern Floating Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 p-4 safe-bottom z-50 pointer-events-none">
        <nav className="w-full max-w-md mx-auto bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 rounded-2xl flex justify-around items-center h-[72px] px-1 pointer-events-auto">
          {navItems.map((item) => {
            const isActive = getIsActive(item.path, location.pathname);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 group active:scale-95`}
              >
                <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive ? 'bg-[#ff4b9a]/10 text-[#ff4b9a]' : 'text-gray-400 group-hover:text-gray-600'}`}>
                    <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-[#ff4b9a]' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
