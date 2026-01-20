
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Hammer, Car, Tv, Armchair, Home as HomeIcon, Truck, Wrench, PenTool, Calendar, ShieldCheck, CreditCard, Clock, CheckCircle2, MapPin, ChevronDown, ChevronUp, Zap, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Logo } from '../components/Logo';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/marketplace', { state: { search: search } });
  };

  const navigateToCategory = (category: string) => {
    navigate('/marketplace', { state: { category: category } });
  };

  const categories = [
    { name: 'Tools & Gadgets', icon: Hammer, catId: 'Tech', desc: 'Drills, cameras' },
    { name: 'Vehicles', icon: Car, catId: 'Vehicles', desc: 'Cars, bikes' },
    { name: 'Electronics', icon: Tv, catId: 'Tech', desc: 'ACs, laptops' },
    { name: 'Home & Living', icon: Armchair, catId: 'All', desc: 'Furniture' },
    { name: 'Places', icon: HomeIcon, catId: 'Real Estate', desc: 'Flats, halls' },
    { name: 'Shifting', icon: Truck, catId: 'Services', desc: 'Moving' },
    { name: 'Repair', icon: Wrench, catId: 'Services', desc: 'Plumbers' },
    { name: 'Skills', icon: PenTool, catId: 'Services', desc: 'Tutors' },
  ];

  const locations = ['Dhaka', 'Chattogram', 'Sylhet', 'Rajshahi', 'Khulna', 'Cumilla', 'Barishal'];

  const faqs = [
    { q: 'What can I rent on Bhara.online?', a: 'You can rent almost anything including tools, electronics, vehicles, flats, office spaces, event items, and professional services.' },
    { q: 'How do I list my item or service?', a: 'Simply create an account, go to "My Space", and use the Inventory section to list your assets. It takes less than 2 minutes.' },
    { q: 'Is Bhara.online safe and verified?', a: 'Yes. We verify owners and renters through NID and mobile verification to ensure a secure marketplace.' },
  ];

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#2d1b4e] text-white overflow-hidden rounded-b-[2.5rem] shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff4b9a] opacity-20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600 opacity-20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10 px-6 pt-10 pb-16 max-w-2xl mx-auto text-center flex flex-col items-center">
          <div className="mb-6 scale-90 origin-center"><Logo light /></div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            {t('home_hero_title')}
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed max-w-md mx-auto">
            {t('home_hero_subtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto mb-8">
            <input 
              type="text" 
              placeholder={t('home_search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-20 py-4 rounded-2xl text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-[#ff4b9a]/30 shadow-lg text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#ff4b9a] text-white px-4 rounded-xl font-bold text-xs hover:bg-[#e63e8a] transition-colors">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate('/marketplace')} className="bg-white text-[#2d1b4e] px-6 py-3 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-transform">
              {t('home_explore')}
            </button>
            <button onClick={() => navigate('/myspace/inventory/select-type')} className="bg-[#ffffff]/10 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-xs active:scale-95 transition-transform hover:bg-white/20">
              {t('home_list_asset')}
            </button>
          </div>
        </div>
      </section>

      {/* 2. TOP CATEGORIES */}
      <section className="px-5 py-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="text-[#ff4b9a] fill-current" size={20} /> {t('home_top_categories')}
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={() => navigateToCategory(cat.catId)}
              className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform group"
            >
              <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm mb-2 text-[#2d1b4e] group-hover:text-[#ff4b9a] group-hover:border-[#ff4b9a]/30 transition-all">
                <cat.icon size={24} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold text-gray-700 leading-tight">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. POPULAR COLLECTIONS */}
      <section className="px-5 py-4 overflow-x-hidden">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Now</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {['Tools', 'Car Rentals', 'Meeting Rooms', 'AC Service', 'Wedding'].map((item, i) => (
            <button 
              key={i}
              onClick={() => navigate('/marketplace')}
              className="flex-shrink-0 px-5 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 whitespace-nowrap hover:bg-[#ff4b9a] hover:text-white hover:border-[#ff4b9a] transition-colors shadow-sm"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* 4. TRUST FACTORS */}
      <section className="px-5 py-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Verified Users', icon: ShieldCheck, color: 'text-green-600' },
            { label: 'Secure Payment', icon: CreditCard, color: 'text-blue-600' },
            { label: 'Real-Time', icon: Clock, color: 'text-orange-600' },
            { label: 'No Hidden Fees', icon: Zap, color: 'text-purple-600' }
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
              <feat.icon size={20} className={feat.color} />
              <span className="text-xs font-bold text-gray-800">{feat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LOCAL DISCOVERY */}
      <section className="bg-gray-50 py-8 px-5">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin size={20} className="text-[#ff4b9a]" /> Rent Near You
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {locations.map((loc, i) => (
            <div 
              key={i} 
              onClick={() => navigate('/marketplace')}
              className="flex-shrink-0 px-6 py-3 bg-white rounded-xl shadow-sm flex items-center justify-center font-bold text-xs text-gray-700 border border-gray-200 cursor-pointer hover:border-[#ff4b9a] transition-all"
            >
              {loc}
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="px-5 py-10 max-w-3xl mx-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">FAQ</h2>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-4 bg-white text-left font-bold text-gray-800 text-xs"
              >
                {f.q}
                {openFaq === i ? <ChevronUp size={16} className="text-[#ff4b9a]" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {openFaq === i && (
                <div className="p-4 bg-gray-50 text-xs text-gray-600 leading-relaxed border-t border-gray-100">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-5 text-sm text-center">
        <p className="mb-2 text-xs">Bhara.online is Bangladesh’s all-in-one rental marketplace.</p>
        <p className="text-[10px]">&copy; 2024 Bhara.online.</p>
      </footer>
    </div>
  );
};

export default Home;
