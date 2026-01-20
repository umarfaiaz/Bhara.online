
import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, MapPin, Star, Building2, Car, Camera, Briefcase, Calendar, ChevronLeft, Share2, Heart, Phone, Mail, CheckCircle2, Clock, Plus, ArrowRight, User, X, BedDouble, Bath, Ruler, Fuel, Settings2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { DataService } from '../services/mockData';
import { AssetType, RentCycle } from '../types';
import { Logo } from '../components/Logo';

// Helper for local auth check
const isAuth = () => localStorage.getItem('bhara_auth') === 'true';

// --- MAIN WRAPPER ---
const Marketplace: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MarketplaceGrid />} />
      <Route path="item/:id" element={<ItemDetails />} />
      <Route path="post" element={<PostAd />} />
    </Routes>
  );
};

// --- 1. MARKETPLACE GRID VIEW ---
const MarketplaceGrid: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Initialize state based on navigation params (from Home shortcuts)
  const initialCategory = location.state?.category || 'All';
  const initialSearch = location.state?.search || '';

  const [activeTab, setActiveTab] = useState<'All' | 'Real Estate' | 'Vehicles' | 'Tech' | 'Events' | 'Services'>('All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(DataService.getMarketplaceItems());
    if (initialCategory) {
        if(initialCategory === 'Tech') setActiveTab('Tech');
        else if(initialCategory === 'Vehicles') setActiveTab('Vehicles');
        else if(initialCategory === 'Real Estate') setActiveTab('Real Estate');
        else if(initialCategory === 'Services') setActiveTab('Services');
        else setActiveTab('All');
    }
    if (initialSearch) setSearch(initialSearch);
  }, [initialCategory, initialSearch]);

  const handlePostAd = () => {
      if (isAuth()) {
          navigate('post');
      } else {
          navigate('/login');
      }
  };

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'All' || item.category === activeTab || (activeTab === 'Real Estate' && item.type === 'Residential');
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || (item.sub || '').toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const categories = [
      { id: 'All', icon: null },
      { id: 'Real Estate', icon: Building2 },
      { id: 'Vehicles', icon: Car },
      { id: 'Tech', icon: Camera },
      { id: 'Events', icon: Calendar },
      { id: 'Services', icon: Briefcase }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
        {/* Sticky Header */}
        <div className="bg-white sticky top-0 z-30 pt-4 pb-2 px-4 shadow-sm border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <Logo size="sm" />
                <button 
                    onClick={handlePostAd}
                    className="flex items-center gap-1.5 bg-[#2d1b4e] text-white px-4 py-2 rounded-full shadow-lg active:scale-95 transition-transform"
                >
                    <Plus size={16} />
                    <span className="text-xs font-bold uppercase tracking-wide">Post Ad</span>
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search apartments, cars..." 
                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border-none rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff4b9a]/20 transition-all placeholder:text-gray-400"
                />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
                {categories.map(cat => (
                    <button 
                        key={cat.id}
                        onClick={() => setActiveTab(cat.id as any)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-xs font-bold transition-all border ${activeTab === cat.id ? 'bg-[#ff4b9a] border-[#ff4b9a] text-white shadow-md shadow-pink-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                        {cat.icon && <cat.icon size={14} />}
                        {cat.id}
                    </button>
                ))}
            </div>
        </div>

        {/* Items Grid - 2 Columns on Mobile */}
        <div className="p-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {filteredItems.map((item, i) => (
                <div 
                    key={i} 
                    onClick={() => navigate(`item/${item.id}`)}
                    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.98] flex flex-col h-full"
                >
                    {/* Image Area */}
                    <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                        <img 
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} 
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-white/95 backdrop-blur-md rounded-lg text-[9px] font-extrabold text-gray-900 uppercase tracking-wide shadow-sm">{item.category}</span>
                        </div>
                        
                        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                            <div className="flex items-center gap-1 text-[10px] text-white font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                                <MapPin size={10} className="text-white"/> {item.city || item.location || 'Dhaka'}
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 leading-tight line-clamp-2 mb-1">{item.name}</h3>
                            <p className="text-[10px] text-gray-500 line-clamp-1">{item.sub || item.description || 'Verified listing'}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                            <p className="text-sm font-extrabold text-[#ff4b9a]">{item.displayPrice}</p>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                                <Star size={10} fill="#f59e0b" className="text-amber-500"/> 4.9
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <ShoppingBag size={48} className="mb-4 opacity-20"/>
                <p className="font-bold text-sm">No items found.</p>
                <p className="text-xs">Try adjusting your filters.</p>
            </div>
        )}
    </div>
  );
};

// ... (Rest of Marketplace.tsx components remain largely the same, but simpler layout for ItemDetails and PostAd is implied via general styling improvements)
// ... keeping existing ItemDetails and PostAd code but wrapped in the cleaner file structure
// --- 2. ITEM DETAILS VIEW ---
const ItemDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<any>(null);
    const [showContact, setShowContact] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const found = DataService.getMarketplaceItems().find(i => i.id === id);
        setItem(found);
    }, [id]);

    if (!item) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    const handleAction = () => {
        if (!isAuth()) {
            navigate('/login');
        } else {
            setShowContact(true);
        }
    };

    const isService = item.type === 'Professional' || item.type === 'Service' || item.type === 'Event Space';
    const isResidential = item.type === 'Residential' || item.type === 'Flat';
    const isVehicle = item.type === 'Vehicle';
    const isGadget = item.type === 'Gadget';

    return (
        <div className="min-h-screen bg-white pb-32 animate-in slide-in-from-right duration-300 relative z-[60]">
            {/* Hero Image */}
            <div className="relative h-72 sm:h-96 bg-gray-200">
                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 right-0 p-5 pt-10 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><Share2 size={20} /></button>
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all"><Heart size={20} /></button>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="-mt-6 rounded-t-3xl bg-white relative z-10 p-6 space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-[60vh]">
                
                {/* Title & Rating */}
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{item.name}</h1>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-extrabold text-[#ff4b9a]">{item.displayPrice}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Per Unit</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1 text-amber-500 font-bold"><Star size={14} fill="currentColor"/> 4.9 (82)</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {item.city || item.location}</span>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Specific Details Cards */}
                <div className="grid grid-cols-2 gap-3">
                    {isResidential && (
                        <>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><BedDouble size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Bedrooms</p><p className="font-bold text-gray-900">{item.bedrooms || 3} Beds</p></div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><Bath size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Bathrooms</p><p className="font-bold text-gray-900">{item.washrooms || 2} Baths</p></div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><Ruler size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Size</p><p className="font-bold text-gray-900">{item.size_sqft || 1200} sqft</p></div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><Building2 size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Level</p><p className="font-bold text-gray-900">Floor {item.floor_no || 2}</p></div>
                            </div>
                        </>
                    )}
                    {isVehicle && (
                        <>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><Car size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Type</p><p className="font-bold text-gray-900">{item.type}</p></div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><Settings2 size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Gear</p><p className="font-bold text-gray-900">{item.transmission || 'Auto'}</p></div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><Fuel size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Fuel</p><p className="font-bold text-gray-900">{item.fuel_type || 'Octane'}</p></div>
                            </div>
                        </>
                    )}
                    {isGadget && (
                        <>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><Camera size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Brand</p><p className="font-bold text-gray-900">{item.brand || 'Generic'}</p></div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-2xl flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><Settings2 size={16}/></div>
                                <div><p className="text-[10px] text-gray-400 font-bold uppercase">Model</p><p className="font-bold text-gray-900">{item.model || 'N/A'}</p></div>
                            </div>
                        </>
                    )}
                </div>

                {/* Host / Owner Info with Privacy Logic */}
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 overflow-hidden">
                                {item.hide_contact ? <div className="w-full h-full bg-purple-100 flex items-center justify-center text-lg">🔒</div> : <img src="https://i.pravatar.cc/150?u=host" className="w-full h-full object-cover"/>}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Hosted by</p>
                                <h4 className="font-bold text-gray-900 flex items-center gap-1">
                                    {item.hide_contact ? "Verified User" : "Bhara Official"}
                                    <ShieldCheck size={14} className="text-green-500"/>
                                </h4>
                            </div>
                        </div>
                        <button className="text-xs font-bold text-[#ff4b9a] border border-[#ff4b9a] px-3 py-1.5 rounded-full hover:bg-pink-50">
                            {item.hide_contact ? "Message" : "View Profile"}
                        </button>
                    </div>
                    {item.hide_contact && <p className="text-[10px] text-gray-400 mt-2 bg-gray-50 p-2 rounded-lg text-center">Owner has hidden direct contact details. Please use the app to communicate.</p>}
                </div>

                {/* Service Selection (If Service) */}
                {isService && (
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Select Package</h3>
                        <div className="space-y-2">
                            {['Basic (4 Hours)', 'Standard (8 Hours)', 'Premium (Full Day)'].map((pkg, i) => (
                                <div key={i} onClick={() => setSelectedService(i as any)} className={`p-3 rounded-xl border flex justify-between items-center cursor-pointer transition-all ${selectedService === i ? 'bg-white border-[#ff4b9a] shadow-sm' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedService === i ? 'border-[#ff4b9a]' : 'border-gray-400'}`}>
                                            {selectedService === i && <div className="w-2 h-2 bg-[#ff4b9a] rounded-full"></div>}
                                        </div>
                                        <span className={`text-sm font-bold ${selectedService === i ? 'text-gray-900' : 'text-gray-500'}`}>{pkg}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">৳{(i+1)*2000}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {item.listing_description || item.description || "Experience top-quality service with our premium offering. Verified by Bhara.online for safety and quality assurance. Ideal for those seeking reliability and excellence."}
                    </p>
                </div>

                {/* Location Map Placeholder */}
                <div className="h-40 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-xs font-bold border border-gray-200">
                    <MapPin size={20} className="mb-1 mr-1"/> Location Map View
                </div>
            </div>

            {/* Sticky Action Footer - High Z-Index to overlap main Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center gap-4 z-[70] max-w-md mx-auto">
                {showContact ? (
                    <div className="flex-1 flex gap-3 animate-in slide-in-from-bottom">
                        {!item.hide_contact && (
                            <button onClick={() => window.open('tel:123456')} className="flex-1 bg-green-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200">
                                <Phone size={18}/> Call
                            </button>
                        )}
                        <button className="flex-1 bg-blue-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
                            <Mail size={18}/> Chat
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col">
                            <span className="text-lg font-extrabold text-gray-900">{item.displayPrice}</span>
                            <span className="text-[10px] font-bold text-green-600 underline">See price breakdown</span>
                        </div>
                        <button 
                            onClick={handleAction}
                            className="flex-1 bg-[#2d1b4e] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all"
                        >
                            {item.hide_contact ? 'Request Info' : 'Contact Host'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// --- 3. POST AD / SELL MODULE ---
const PostAd: React.FC = () => {
    const navigate = useNavigate();
    
    // Redirect check
    useEffect(() => {
        if(!isAuth()) navigate('/login');
    }, []);

    const [mode, setMode] = useState<'existing' | 'new'>('existing');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [unlistedItems, setUnlistedItems] = useState<any[]>([]);
    const [hideContact, setHideContact] = useState(false);
    
    useEffect(() => {
        const b = DataService.getBuildings().filter(x => !x.is_listed && x.type !== 'Residential').map(x => ({...x, type: x.type, label: x.name, sub: `Entire ${x.type} Property`})); 
        const f = DataService.getFlats().filter(x => !x.is_listed).map(x => {
             const parent = DataService.getBuildingById(x.building_id);
             return {...x, type: 'Flat', label: `Flat ${x.flat_no}`, sub: parent ? `${parent.name}, ${parent.area}` : 'Residential Unit'};
        });
        const v = DataService.getVehicles().filter(x => !x.is_listed).map(x => ({...x, type: 'Vehicle', label: x.name, sub: x.license_plate}));
        const g = DataService.getGadgets().filter(x => !x.is_listed).map(x => ({...x, type: 'Gadget', label: x.name, sub: x.model}));
        const s = DataService.getServices().filter(x => !x.is_listed).map(x => ({...x, type: 'Service', label: x.name, sub: x.category}));
        
        setUnlistedItems([...f, ...v, ...g, ...s, ...b]);
    }, []);

    const handlePublish = () => {
        if (!selectedId) return;
        const item = unlistedItems.find(i => i.id === selectedId);
        if (item) {
            DataService.toggleListing(selectedId, item.type, true, hideContact);
            alert("Successfully Posted to Marketplace!");
            navigate('/marketplace');
        }
    };

    const handleCreateNew = (type: string) => {
        // Redirect to inventory config
        if(type === 'Residential') navigate('/myspace/inventory/config-flat'); 
        else if(type === 'Vehicle') navigate('/myspace/inventory/config-vehicle');
        else if(type === 'Gadget') navigate('/myspace/inventory/config-gadget');
        else navigate('/myspace/inventory/config-service');
    };

    return (
        <div className="min-h-screen bg-white animate-in slide-in-from-bottom duration-300 relative z-[60]">
            <div className="p-5 border-b border-gray-100 flex items-center gap-3 sticky top-0 bg-white z-20">
                <button onClick={() => navigate('/marketplace')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
                <h2 className="text-xl font-bold text-gray-900">Post Ad</h2>
            </div>

            <div className="p-5">
                {/* Mode Toggle */}
                <div className="bg-gray-100 p-1 rounded-xl flex mb-8">
                    <button onClick={() => setMode('existing')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === 'existing' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Select from Inventory</button>
                    <button onClick={() => setMode('new')} className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${mode === 'new' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Create New</button>
                </div>

                {mode === 'existing' ? (
                    <div className="space-y-4 pb-20">
                        <p className="text-sm text-gray-500 font-medium">Select a unit or item to list.</p>
                        {unlistedItems.length > 0 ? unlistedItems.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => setSelectedId(item.id)}
                                className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${selectedId === item.id ? 'border-[#ff4b9a] bg-pink-50 ring-1 ring-[#ff4b9a]' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{item.label}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md uppercase border border-gray-200">{item.type === 'Flat' ? 'Residential Unit' : item.type}</span>
                                        <span className="text-xs text-gray-500 truncate max-w-[150px]">{item.sub}</span>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedId === item.id ? 'border-[#ff4b9a]' : 'border-gray-300'}`}>
                                    {selectedId === item.id && <div className="w-2.5 h-2.5 bg-[#ff4b9a] rounded-full"></div>}
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-400">
                                <p>No unlisted items available.</p>
                                <p className="text-xs mt-1">Create a new item to post.</p>
                            </div>
                        )}
                        
                        {selectedId && (
                            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 safe-bottom shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-50">
                                <div className="mb-4 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <button onClick={() => setHideContact(!hideContact)} className={`w-10 h-6 rounded-full transition-colors relative ${hideContact ? 'bg-gray-900' : 'bg-gray-300'}`}>
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${hideContact ? 'left-5' : 'left-1'}`}></div>
                                    </button>
                                    <span className="text-xs font-bold text-gray-700">Hide my contact details on listing</span>
                                </div>
                                <button onClick={handlePublish} className="w-full py-4 bg-[#ff4b9a] text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-transform">
                                    Publish to Marketplace
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Unit / Flat', icon: Building2, type: 'Residential', color: 'bg-blue-50 text-blue-600' },
                            { label: 'Vehicle', icon: Car, type: 'Vehicle', color: 'bg-indigo-50 text-indigo-600' },
                            { label: 'Equipment', icon: Camera, type: 'Gadget', color: 'bg-orange-50 text-orange-600' },
                            { label: 'Service', icon: Briefcase, type: 'Professional', color: 'bg-purple-50 text-purple-600' },
                        ].map((cat) => (
                            <button 
                                key={cat.label}
                                onClick={() => handleCreateNew(cat.type)}
                                className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-95 bg-white"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${cat.color}`}>
                                    <cat.icon size={28} />
                                </div>
                                <span className="font-bold text-gray-900">{cat.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
