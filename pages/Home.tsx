
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Shield, Zap, Star, TrendingUp, Building2, Car, Camera, Briefcase, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Logo } from '../components/Logo';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/marketplace', { state: { search } });
  };

  const trendingItems = [
    { id: 1, title: 'Sony A7III Kit', category: 'Gadgets', price: '৳1,500/day', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800', rating: 4.9 },
    { id: 2, title: 'Toyota Axio 2019', category: 'Vehicles', price: '৳3,000/day', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800', rating: 4.8 },
    { id: 3, title: 'Luxury Studio Apt', category: 'Living', price: '৳25k/mo', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800', rating: 5.0 },
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-[#ff4b9a] selection:text-white">
      
      {/* 1. HERO SECTION: Clean, Typography-led, Modern Gradient */}
      <section className="relative pt-24 pb-32 overflow-hidden px-4 sm:px-6">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none overflow-hidden">
            <div className="absolute top-20 right-[-20%] md:right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-200/40 rounded-full blur-[80px] md:blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-0 left-[-20%] md:left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-pink-200/30 rounded-full blur-[100px] md:blur-[120px]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff4b9a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff4b9a]"></span>
                </span>
                <span className="text-xs font-bold text-gray-600 tracking-wide uppercase">The #1 Rental Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.15] mb-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
                Own Less. <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d1b4e] via-[#ff4b9a] to-[#ff4b9a]">Experience More.</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 px-4">
                Access verified vehicles, properties, gadgets, and services instantly. The smart way to live in Bangladesh.
            </p>

            {/* Search Bar - Elevated */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto bg-white p-2 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-2 animate-in zoom-in-95 duration-1000 delay-300 transform hover:scale-[1.01] transition-transform">
                <div className="pl-4 sm:pl-6 text-gray-400">
                    <Search size={24}/>
                </div>
                <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search cars, flats, cameras..." 
                    className="flex-1 py-3 sm:py-4 text-base sm:text-lg font-medium text-gray-900 placeholder:text-gray-400 outline-none bg-transparent min-w-0"
                />
                <button 
                    type="submit"
                    className="bg-[#2d1b4e] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-[1.5rem] font-bold text-sm sm:text-base hover:bg-black transition-colors shadow-lg active:scale-95 whitespace-nowrap"
                >
                    Search
                </button>
            </form>

            {/* Quick Tags */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in duration-1000 delay-500 px-2">
                {['DSLR Camera', 'Bachelor Flat', 'Rent A Car', 'Generator'].map(tag => (
                    <button key={tag} onClick={() => navigate('/marketplace', { state: { search: tag } })} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-500 hover:border-[#ff4b9a] hover:text-[#ff4b9a] transition-colors shadow-sm">
                        {tag}
                    </button>
                ))}
            </div>
        </div>
      </section>

      {/* 2. VALUE PROP / BENTO GRID */}
      <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
                  {/* Card 1: Large */}
                  <div onClick={() => navigate('/marketplace', { state: { category: 'Vehicles' } })} className="md:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full min-h-[300px] flex flex-col justify-center">
                      <div className="relative z-10 max-w-sm">
                          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm">
                              <Car size={28} />
                          </div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-3">Mobility on Demand</h3>
                          <p className="text-gray-500 font-medium mb-8 leading-relaxed">From daily commutes to weekend getaways, find the perfect ride without the hassle of ownership.</p>
                          <span className="inline-flex items-center gap-2 font-bold text-blue-600 group-hover:translate-x-2 transition-transform">Explore Vehicles <ArrowRight size={18}/></span>
                      </div>
                      <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800" className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700 hidden md:block" style={{ maskImage: 'linear-gradient(to left, black 50%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 100%)' }} />
                  </div>

                  {/* Card 2: Tall */}
                  <div onClick={() => navigate('/marketplace', { state: { category: 'Tech' } })} className="bg-[#2d1b4e] rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer text-white shadow-xl hover:shadow-2xl hover:shadow-indigo-900/20 transition-all h-full min-h-[300px] flex flex-col justify-between">
                      <div className="relative z-10">
                          <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-6 border border-white/10">
                              <Camera size={28} />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Creator Gear</h3>
                          <p className="text-gray-300 text-sm leading-relaxed">Cameras, drones, and lenses for your next masterpiece.</p>
                      </div>
                      <span className="inline-flex items-center gap-2 font-bold mt-8 group-hover:translate-x-2 transition-transform relative z-10">Browse Tech <ArrowRight size={18}/></span>
                      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#ff4b9a] rounded-full blur-[80px] opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  </div>

                  {/* Card 3 */}
                  <div onClick={() => navigate('/marketplace', { state: { category: 'Real Estate' } })} className="bg-white rounded-[2.5rem] p-8 relative overflow-hidden group cursor-pointer border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full min-h-[260px] flex flex-col justify-between">
                        <div>
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 shadow-sm">
                                <Building2 size={28} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Spaces</h3>
                            <p className="text-gray-500 text-sm mb-4">Offices, apartments, and event halls.</p>
                        </div>
                        <span className="inline-flex items-center gap-2 font-bold text-orange-600 group-hover:translate-x-2 transition-transform">Find Space <ArrowRight size={18}/></span>
                  </div>

                  {/* Card 4 */}
                  <div onClick={() => navigate('/marketplace', { state: { category: 'Services' } })} className="md:col-span-2 bg-gradient-to-r from-pink-50 to-purple-50 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group cursor-pointer border border-pink-100 shadow-sm hover:shadow-xl transition-all flex flex-col sm:flex-row items-center justify-between gap-6 h-full min-h-[200px]">
                      <div className="max-w-md">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">Professional Services</h3>
                          <p className="text-gray-600 font-medium leading-relaxed">Need a photographer, driver, or plumber? Hire verified professionals instantly.</p>
                      </div>
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md text-[#ff4b9a] group-hover:scale-110 transition-transform shrink-0">
                          <Briefcase size={36} />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 3. FEATURED LISTINGS */}
      <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-end mb-12">
                  <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Trending This Week</h2>
                      <p className="text-gray-500">Highly rated rentals near you.</p>
                  </div>
                  <button onClick={() => navigate('/marketplace')} className="hidden md:flex items-center gap-2 font-bold text-gray-900 hover:text-[#ff4b9a] transition-colors">
                      View All <ArrowRight size={20}/>
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {trendingItems.map((item) => (
                      <div key={item.id} onClick={() => navigate('/marketplace')} className="group cursor-pointer">
                          <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-5 bg-gray-100 shadow-sm border border-gray-100">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">{item.category}</div>
                              <button className="absolute top-4 right-4 p-2 bg-white/50 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all">
                                  <Heart size={18} />
                              </button>
                          </div>
                          <div className="px-2">
                              <div className="flex justify-between items-start mb-1">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#ff4b9a] transition-colors">{item.title}</h3>
                                  <div className="flex items-center gap-1 font-bold text-sm bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg">
                                      <Star size={14} className="fill-orange-600" /> {item.rating}
                                  </div>
                              </div>
                              <p className="text-gray-500 font-medium">{item.price}</p>
                          </div>
                      </div>
                  ))}
              </div>
              
              <button onClick={() => navigate('/marketplace')} className="md:hidden w-full mt-8 py-4 bg-gray-50 rounded-2xl font-bold text-gray-900 border border-gray-200">
                  View All Listings
              </button>
          </div>
      </section>

      {/* 4. TRUST & SAFETY */}
      <section className="py-24 bg-[#2d1b4e] text-white overflow-hidden relative">
          {/* Background Patterns */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div>
                      <div className="inline-block p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-md">
                          <Shield size={32} className="text-[#ff4b9a]" />
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Safety First. <br/>Always.</h2>
                      <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                          We take trust seriously. Every user is verified with NID, and payments are held securely until the rental period starts.
                      </p>
                      
                      <div className="space-y-4">
                          <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400"><ShieldCheck size={16}/></div>
                              <span className="font-medium">NID Verified Users</span>
                          </div>
                          <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><Zap size={16}/></div>
                              <span className="font-medium">Instant Booking Confirmation</span>
                          </div>
                          <div className="flex items-center gap-4">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400"><Star size={16}/></div>
                              <span className="font-medium">Community Ratings & Reviews</span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="relative mt-12 md:mt-0">
                        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-[#ff4b9a] rounded-full flex items-center justify-center font-bold text-xl">B</div>
                                <div>
                                    <h4 className="font-bold text-lg">Verified Owner</h4>
                                    <p className="text-xs text-gray-400">Dhaka, Bangladesh</p>
                                </div>
                                <ShieldCheck className="ml-auto text-green-400" size={24}/>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full mb-4 w-3/4"></div>
                            <div className="h-2 bg-white/10 rounded-full mb-8 w-1/2"></div>
                            <div className="flex gap-4">
                                <div className="flex-1 bg-[#ff4b9a] py-3 rounded-xl text-center font-bold text-sm">Contact</div>
                                <div className="flex-1 bg-white/10 py-3 rounded-xl text-center font-bold text-sm">Profile</div>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
                            <div className="bg-green-100 p-2 rounded-full text-green-600"><TrendingUp size={20}/></div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Success Rate</p>
                                <p className="font-bold text-lg">99.8%</p>
                            </div>
                        </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto bg-[#f8f9fa] rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#ff4b9a]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="relative z-10 max-w-3xl mx-auto">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Turn your idle assets into income.</h2>
                  <p className="text-xl text-gray-500 mb-10">Start earning today by listing your car, camera, or flat on Bhara.online.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button onClick={() => navigate('/myspace/inventory/select-type')} className="bg-[#2d1b4e] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:bg-black transition-all active:scale-95">
                          List an Item
                      </button>
                      <button onClick={() => navigate('/register')} className="bg-white border-2 border-gray-200 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg hover:border-[#2d1b4e] transition-all">
                          Create Account
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
                  <div>
                      <Logo size="lg" />
                      <p className="mt-4 text-gray-500 max-w-xs">Building the future of shared economy in Bangladesh. Rent smart, live better.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
                      <div>
                          <h4 className="font-bold text-gray-900 mb-4">Marketplace</h4>
                          <ul className="space-y-3 text-sm text-gray-500">
                              <li className="hover:text-[#ff4b9a] cursor-pointer">All Categories</li>
                              <li className="hover:text-[#ff4b9a] cursor-pointer">Vehicles</li>
                              <li className="hover:text-[#ff4b9a] cursor-pointer">Properties</li>
                              <li className="hover:text-[#ff4b9a] cursor-pointer">Electronics</li>
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                          <ul className="space-y-3 text-sm text-gray-500">
                              <li className="hover:text-[#ff4b9a] cursor-pointer">About Us</li>
                              <li className="hover:text-[#ff4b9a] cursor-pointer">Careers</li>
                              <li className="hover:text-[#ff4b9a] cursor-pointer">Safety</li>
                              <li className="hover:text-[#ff4b9a] cursor-pointer">Contact</li>
                          </ul>
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
                          <ul className="space-y-3 text-sm text-gray-500">
                              <li className="hover:text-[#ff4b9a] cursor-pointer">Terms of Service</li>
                              <li className="hover:text-[#ff4b9a] cursor-pointer">Privacy Policy</li>
                          </ul>
                      </div>
                  </div>
              </div>
              
              <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                  <p>&copy; 2026 Bhara.online Inc.</p>
                  <div className="flex gap-6 mt-4 md:mt-0">
                      <span>Facebook</span>
                      <span>Instagram</span>
                      <span>LinkedIn</span>
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Home;
