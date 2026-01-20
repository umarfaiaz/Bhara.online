
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
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#2d1b4e] text-white overflow-hidden md:rounded-b-[4rem] rounded-b-[2.5rem] shadow-2xl min-h-[600px] flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#ff4b9a] opacity-20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600 opacity-20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="relative z-10 px-6 pt-20 pb-20 max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="mb-8 scale-90 origin-center md:hidden"><Logo light /></div>
          {/* Logo is now in fixed header for desktop, so we hide it here to avoid duplication */}
          
          <h1 className="text-4xl md:text-7xl font-extrabold leading-tight mb-8 tracking-tight">
            {t('home_hero_title')}
          </h1>
          <p className="text-gray-300 text-base md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            {t('home_hero_subtitle')}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto mb-10 group">
            <input 
              type="text" 
              placeholder={t('home_search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-32 py-5 md:py-6 rounded-3xl text-gray-900 font-bold focus:outline-none focus:ring-4 focus:ring-[#ff4b9a]/30 shadow-2xl text-base md:text-lg transition-all"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff4b9a] transition-colors" size={24} />
            <button type="submit" className="absolute right-3 top-3 bottom-3 bg-[#ff4b9a] text-white px-8 rounded-2xl font-bold text-sm hover:bg-[#e63e8a] transition-all hover:scale-105 active:scale-95 shadow-lg">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={() => navigate('/marketplace')} className="bg-white text-[#2d1b4e] px-8 py-4 rounded-2xl font-bold text-sm md:text-base shadow-xl active:scale-95 transition-transform hover:bg-gray-50">
              {t('home_explore')}
            </button>
            <button onClick={() => navigate('/myspace/inventory/select-type')} className="bg-[#ffffff]/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-sm md:text-base active:scale-95 transition-transform hover:bg-white/20">
              {t('home_list_asset')}
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* 2. TOP CATEGORIES */}
        <section className="py-20">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-12 flex items-center gap-3 justify-center">
                <div className="p-2 bg-pink-100 rounded-xl"><Zap className="text-[#ff4b9a] fill-current" size={24} /></div>
                {t('home_top_categories')}
            </h2>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-6 md:gap-8">
            {categories.map((cat, i) => (
                <div 
                key={i} 
                onClick={() => navigateToCategory(cat.catId)}
                className="flex flex-col items-center text-center cursor-pointer active:scale-95 transition-transform group"
                >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center shadow-sm mb-4 text-[#2d1b4e] group-hover:text-[#ff4b9a] group-hover:border-[#ff4b9a]/30 group-hover:bg-[#ff4b9a]/5 group-hover:shadow-md transition-all duration-300">
                    <cat.icon size={28} className="md:w-10 md:h-10" strokeWidth={1.5} />
                </div>
                <span className="text-xs md:text-sm font-bold text-gray-700 leading-tight group-hover:text-gray-900">{cat.name}</span>
                </div>
            ))}
            </div>
        </section>

        {/* 3. POPULAR COLLECTIONS */}
        <section className="py-12 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending Now</h2>
            <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide md:flex-wrap">
            {['Tools', 'Car Rentals', 'Meeting Rooms', 'AC Service', 'Wedding', 'Cameras', 'Apartments', 'Bikes', 'Generators', 'Sound System'].map((item, i) => (
                <button 
                key={i}
                onClick={() => navigate('/marketplace')}
                className="flex-shrink-0 px-8 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-700 whitespace-nowrap hover:bg-[#ff4b9a] hover:text-white hover:border-[#ff4b9a] transition-all shadow-sm hover:shadow-lg hover:-translate-y-1"
                >
                {item}
                </button>
            ))}
            </div>
        </section>

        {/* 4. TRUST FACTORS */}
        <section className="py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
                { label: 'Verified Users', icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Secure Payment', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Real-Time', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'No Hidden Fees', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50' }
            ].map((feat, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <div className={`w-16 h-16 rounded-full ${feat.bg} flex items-center justify-center ${feat.color}`}>
                        <feat.icon size={32} />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{feat.label}</span>
                </div>
            ))}
            </div>
        </section>

        {/* 5. LOCAL DISCOVERY */}
        <section className="bg-gray-50 py-16 px-6 md:px-12 rounded-[3rem] my-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 flex items-center justify-center gap-3">
            <MapPin size={32} className="text-[#ff4b9a]" /> Rent Near You
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-start md:justify-center">
            {locations.map((loc, i) => (
                <div 
                key={i} 
                onClick={() => navigate('/marketplace')}
                className="flex-shrink-0 px-10 py-5 bg-white rounded-3xl shadow-sm flex items-center justify-center font-bold text-base text-gray-700 border border-gray-200 cursor-pointer hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-all hover:shadow-lg hover:-translate-y-1"
                >
                {loc}
                </div>
            ))}
            </div>
        </section>

        {/* 6. FAQ */}
        <section className="py-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
            {faqs.map((f, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex justify-between items-center p-6 text-left font-bold text-gray-900 text-lg"
                >
                    {f.q}
                    {openFaq === i ? <ChevronUp size={24} className="text-[#ff4b9a]" /> : <ChevronDown size={24} className="text-gray-400" />}
                </button>
                {openFaq === i && (
                    <div className="px-6 pb-6 text-base text-gray-500 leading-relaxed">
                    {f.a}
                    </div>
                )}
                </div>
            ))}
            </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 pt-10 px-6 text-sm pb-32 md:pb-10">
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-12 mb-8">
                <div className="text-center md:text-left">
                    <div className="mb-6"><Logo light size="lg" /></div>
                    <p className="max-w-xs text-gray-500">The most trusted rental marketplace in Bangladesh. Safe, secure, and simple.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-left">
                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Company</h4>
                        <ul className="space-y-4">
                            <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Support</h4>
                        <ul className="space-y-4">
                            <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Safety</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Terms</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Social</h4>
                        <ul className="space-y-4">
                            <li onClick={() => window.open('https://web.facebook.com/profile.php?id=61586846603763', '_blank')} className="hover:text-white cursor-pointer transition-colors">Facebook</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Twitter</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Instagram</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-base">Legal</h4>
                        <ul className="space-y-4">
                            <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
                            <li className="hover:text-white cursor-pointer transition-colors">Cookie Policy</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="pt-8 border-t border-gray-800 text-center md:text-left text-gray-600">
                <p>&copy; 2026 Bairbhara.online. All Rights Reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
