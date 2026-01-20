
import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, MapPin, Star, Building2, Car, Camera, Briefcase, Calendar, ChevronLeft, ChevronRight, Share2, Heart, Phone, Mail, CheckCircle2, Clock, Plus, ArrowRight, User, X, BedDouble, Bath, Ruler, Fuel, Settings2, ShieldCheck, Eye, EyeOff, LayoutGrid, Zap, Image as ImageIcon, MessageCircle, Edit3, Trash2, Navigation, MousePointerClick, Check } from 'lucide-react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { DataService, ChatService, UserService } from '../services/mockData';
import { AssetType, RentCycle } from '../types';
import { Logo } from '../components/Logo';

// Helper for local auth check
const isAuth = () => localStorage.getItem('bhara_auth') === 'true';

// --- MAIN WRAPPER ---
const Marketplace: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MarketplaceGrid />} />
      <Route path="manage" element={<MyListings />} />
      <Route path="item/:id" element={<ItemDetails />} />
      <Route path="post" element={<PostAd />} />
    </Routes>
  );
};

// --- ASSET CARD (E-Commerce Style) ---
const AssetCard: React.FC<{ item: any, onClick: () => void, isOwner?: boolean, onEdit?: () => void, onUnlist?: () => void }> = ({ item, onClick, isOwner, onEdit, onUnlist }) => {
    const isFlat = item.assetType === 'Residential';
    const isInstant = item.booking_type === 'instant';
    
    return (
        <div 
            onClick={onClick}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col h-full relative"
        >
            {/* Image Area */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-gray-900 uppercase tracking-wide shadow-sm">
                        {item.category}
                    </span>
                    {isInstant && <span className="px-2 py-1 bg-[#ff4b9a]/90 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase tracking-wide shadow-sm flex items-center gap-1"><Zap size={8}/> Instant</span>}
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={14} />
                </button>
                
                {/* Location Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                    <div className="flex items-center gap-1 text-[10px] text-white font-medium">
                        <MapPin size={10} className="text-[#ff4b9a]"/> {item.city || item.location || 'Dhaka'}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 flex-1 mr-2">{item.name}</h3>
                    <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-600">
                        <Star size={10} className="text-orange-400 fill-orange-400"/> 4.8
                    </div>
                </div>

                {/* Quick Specs */}
                <p className="text-xs text-gray-500 mb-3 line-clamp-1">
                    {isFlat ? `${item.details?.bedrooms || 3} Bed • ${item.details?.size || 1200} sqft` : item.listing_description || 'Verified Asset'}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Rent</p>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-base font-extrabold text-[#2d1b4e]">{item.displayPrice}</span>
                            <span className="text-[10px] text-gray-500 font-medium">{item.period}</span>
                        </div>
                    </div>
                    {isOwner ? (
                        <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} className="p-2 bg-gray-100 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600"><Edit3 size={14}/></button>
                            <button onClick={(e) => { e.stopPropagation(); onUnlist && onUnlist(); }} className="p-2 bg-gray-100 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600"><Trash2 size={14}/></button>
                        </div>
                    ) : (
                        <button className="bg-[#ff4b9a] text-white p-2 rounded-xl shadow-lg shadow-pink-200 active:scale-95 transition-transform">
                            <ArrowRight size={16}/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- MARKETPLACE GRID ---
const MarketplaceGrid: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'All' | 'Real Estate' | 'Vehicles' | 'Tech' | 'Events' | 'Services'>('All');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(DataService.getMarketplaceItems());
    if (location.state?.category) setActiveTab(location.state.category);
    if (location.state?.search) setSearch(location.state.search);
  }, [location.state]);

  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === 'All' || item.category === activeTab || (activeTab === 'Real Estate' && item.type === 'Residential');
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || (item.sub || '').toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handlePostAd = () => isAuth() ? navigate('post') : navigate('/login');

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-28">
        {/* Sticky Header */}
        <div className="bg-white sticky top-0 z-30 shadow-sm border-b border-gray-200 transition-all duration-300">
            <div className="max-w-7xl mx-auto w-full px-4 py-3">
                <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2" onClick={() => navigate('/home')}>
                        <div className="md:hidden"><Logo size="sm" /></div>
                        <h2 className="hidden md:block text-xl font-extrabold text-gray-900 tracking-tight">Marketplace</h2>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg relative">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Search cars, cameras, flats..." 
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#ff4b9a] transition-all placeholder:text-gray-400"
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => navigate('manage')} className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 hidden sm:block"><User size={20}/></button>
                        <button onClick={handlePostAd} className="flex items-center gap-2 bg-[#2d1b4e] text-white px-4 py-2.5 rounded-xl shadow-lg active:scale-95 transition-all">
                            <Plus size={18} />
                            <span className="text-xs font-bold uppercase hidden sm:block">Post Ad</span>
                        </button>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { id: 'All', icon: LayoutGrid }, { id: 'Real Estate', icon: Building2 }, { id: 'Vehicles', icon: Car },
                        { id: 'Tech', icon: Camera }, { id: 'Events', icon: Calendar }, { id: 'Services', icon: Briefcase }
                    ].map(cat => (
                        <button 
                            key={cat.id} 
                            onClick={() => setActiveTab(cat.id as any)} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-xs font-bold transition-all border ${activeTab === cat.id ? 'bg-[#ff4b9a] border-[#ff4b9a] text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                        >
                            <cat.icon size={14} />{cat.id}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">{filteredItems.length} Listings Found</h3>
                <button className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm"><Filter size={14}/> Filter</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item, i) => <AssetCard key={i} item={item} onClick={() => navigate(`item/${item.id}`)} />)}
            </div>
            
            {filteredItems.length === 0 && (
                <div className="text-center py-20 flex flex-col items-center">
                    <ShoppingBag size={64} className="text-gray-200 mb-4"/>
                    <h3 className="text-lg font-bold text-gray-900">No items found</h3>
                    <p className="text-sm text-gray-500">Try adjusting your search or category.</p>
                </div>
            )}
        </div>
    </div>
  );
};

// --- ITEM DETAILS (E-Commerce Style) ---
const ItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const item = DataService.getMarketplaceItems().find(i => i.id === id) as any;
    const currentUser = UserService.getCurrentUser();
    const [showBookingModal, setShowBookingModal] = useState(false);

    if (!item) return <div>Item not found</div>;

    const isOwner = item.user_id === currentUser.id;
    // Mock Owner Data (In real app, fetch from user_id)
    const owner = {
        name: isOwner ? currentUser.name : 'Rafiqul Islam', // Mock name for demo
        joined: '2023',
        rating: 4.9,
        response: '1 hr',
        avatar: isOwner ? currentUser.avatar : 'https://i.pravatar.cc/150?u=owner',
        verified: true
    };

    const isInstant = item.booking_type === 'instant';

    const handleAction = () => {
        if (!isAuth()) { navigate('/login'); return; }
        
        if (isOwner) {
            // Even if owner, show preview alert instead of manage
            alert("This is how users see your listing. Use My Space to manage.");
            return;
        }

        if (isInstant) {
            // Trigger Booking Modal
            setShowBookingModal(true);
        } else {
            // Start Chat Flow
            DataService.notifyOwner(item.user_id, 'New Rental Request', `${currentUser.name} requested to rent ${item.name}.`);
            ChatService.startChat(item.user_id, `Hi, I am interested in renting ${item.name}. Is it available?`);
            navigate('/inbox');
        }
    };

    const handleConfirmBooking = () => {
        // Mock Booking Success
        DataService.notifyOwner(item.user_id, 'New Instant Booking', `${currentUser.name} booked ${item.name} instantly.`);
        alert('Booking Confirmed! The owner has been notified.');
        setShowBookingModal(false);
        navigate('/inbox');
    };

    return (
        <div className="min-h-screen bg-white pb-32 animate-in slide-in-from-bottom duration-300">
            {/* Header / Nav */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex justify-between items-center">
                <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"><ChevronLeft size={20}/></button>
                <h1 className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{item.name}</h1>
                <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-full hover:text-red-500 transition-colors"><Heart size={20}/></button>
                    <button className="p-2 bg-gray-100 rounded-full hover:text-blue-500 transition-colors"><Share2 size={20}/></button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-0 md:p-8">
                {/* Left: Images */}
                <div className="bg-gray-100 md:rounded-3xl overflow-hidden relative group aspect-[4/3] md:aspect-square">
                    <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} className="w-full h-full object-cover" />
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1">
                        <ImageIcon size={12}/> 1/3
                    </div>
                    {isInstant && <div className="absolute top-4 left-4 bg-[#ff4b9a] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1"><Zap size={12}/> Instant Book</div>}
                </div>

                {/* Right: Details */}
                <div className="px-5 md:px-0 space-y-8">
                    
                    {/* Title & Price */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[#ff4b9a] font-extrabold text-xs uppercase tracking-wider bg-pink-50 px-2 py-1 rounded-md">{item.category}</span>
                            <div className="flex items-center gap-1 text-orange-500 font-bold text-sm"><Star size={14} fill="currentColor"/> 4.8 (24)</div>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{item.name}</h1>
                        <p className="text-gray-500 flex items-center gap-2 text-sm font-medium"><MapPin size={16} className="text-gray-400"/> {item.location || item.city}</p>
                        
                        <div className="mt-6 flex items-baseline gap-2 pb-6 border-b border-gray-100">
                            <span className="text-4xl font-black text-gray-900">{item.displayPrice}</span>
                            <span className="text-base font-bold text-gray-400">{item.period}</span>
                        </div>
                    </div>

                    {/* Owner / Lender Profile Card */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={owner.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" alt="Owner"/>
                                {owner.verified && <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white"><CheckCircle2 size={10}/></div>}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{owner.name}</h4>
                                <p className="text-[10px] text-gray-500 font-medium">Owner • Joined {owner.joined}</p>
                                <p className="text-[10px] text-green-600 font-bold mt-0.5 flex items-center gap-1"><Clock size={10}/> Responds within {owner.response}</p>
                            </div>
                        </div>
                        <button onClick={() => { if(!isOwner) ChatService.startChat(item.user_id, `Hi, about ${item.name}...`); navigate('/inbox'); }} className="bg-white border border-gray-200 p-2.5 rounded-xl text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                            <MessageCircle size={20}/>
                        </button>
                    </div>

                    {/* Specifications Grid */}
                    {item.details && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Specifications</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(item.details).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                                            {key === 'bedrooms' ? <BedDouble size={16}/> : 
                                             key === 'size' ? <Ruler size={16}/> :
                                             key === 'fuel' ? <Fuel size={16}/> : <Zap size={16}/>}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{key}</p>
                                            <p className="text-sm font-bold text-gray-900 capitalize">{value as string}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">About this rental</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {item.listing_description || item.description || "Well maintained and fully verified asset. Contact owner for more specific details regarding availability and terms."}
                        </p>
                    </div>

                    {/* Location Map Placeholder */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Location</h3>
                        <div className="h-40 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                            <MapPin size={32} className="text-blue-500 mb-2"/>
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">View on Map</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] safe-bottom z-50">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <div className="hidden md:block">
                        <p className="text-xs text-gray-400 font-bold uppercase">Total Price</p>
                        <p className="text-xl font-black text-gray-900">{item.displayPrice}</p>
                    </div>
                    <button onClick={() => window.location.href = `tel:123`} className="w-14 h-14 bg-gray-100 text-gray-900 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <Phone size={24}/>
                    </button>
                    
                    {/* Dynamic Booking Button */}
                    <button 
                        onClick={handleAction} 
                        className={`flex-1 py-4 font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isInstant ? 'bg-black text-white shadow-gray-200' : 'bg-[#2d1b4e] text-white shadow-indigo-200'}`}
                    >
                        {isOwner ? (
                            <span>Preview Mode</span> 
                        ) : isInstant ? (
                            <>Book Instantly <Zap size={20} className="fill-current text-yellow-400"/></>
                        ) : (
                            <>Request to Rent <MessageCircle size={20}/></>
                        )}
                    </button>
                </div>
            </div>

            {/* Booking Confirmation Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative">
                        <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100"><X size={20}/></button>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                <CheckCircle2 size={32}/>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Confirm Booking</h3>
                            <p className="text-sm text-gray-500 mt-1">You are booking {item.name}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Rate</span>
                                <span className="font-bold">{item.displayPrice} {item.period}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Service Fee</span>
                                <span className="font-bold">৳ 50</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-black">
                                <span>Total</span>
                                <span>{item.displayPrice}</span>
                            </div>
                        </div>

                        <button onClick={handleConfirmBooking} className="w-full py-4 bg-black text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">
                            Confirm & Pay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MY LISTINGS (Simplified) ---
const MyListings: React.FC = () => {
    const navigate = useNavigate();
    const currentUser = UserService.getCurrentUser();
    const [myItems, setMyItems] = useState(DataService.getMarketplaceItems().filter(i => i.user_id === currentUser.id));

    const handleUnlist = (id: string, type: AssetType | 'Flat') => {
        if(confirm("Are you sure you want to unlist this item?")) {
            DataService.toggleListing(id, type, false);
            setMyItems(prev => prev.filter(i => i.id !== id));
        }
    };

    const handleEdit = (item: any) => {
        if(item.assetType === 'Residential' && item.flat_no) {
            navigate('/myspace/inventory/config-flat', { state: { editId: item.id, buildingId: item.building_id } });
        } else if (item.assetType === 'Vehicle') {
            navigate('/myspace/inventory/config-vehicle', { state: { editId: item.id } });
        } else {
            navigate('/myspace/inventory');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white p-5 border-b border-gray-100 sticky top-0 z-40 flex items-center gap-3">
                <button onClick={() => navigate('/marketplace')} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft size={24}/></button>
                <h2 className="font-bold text-lg">My Listings</h2>
            </div>
            <div className="max-w-7xl mx-auto p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {myItems.map(item => (
                    <AssetCard 
                        key={item.id} 
                        item={item} 
                        onClick={() => navigate(`/marketplace/item/${item.id}`)}
                        isOwner={true}
                        onEdit={() => handleEdit(item)}
                        onUnlist={() => handleUnlist(item.id, (item.assetType === 'Residential' ? 'Flat' : item.assetType) as AssetType | 'Flat')}
                    />
                ))}
                {myItems.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4"/>
                        <p className="text-gray-500 font-medium">You haven't listed anything yet.</p>
                        <button onClick={() => navigate('/marketplace/post')} className="mt-4 text-[#ff4b9a] font-bold">Post an Ad</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- POST AD FLOW ---
const PostAd: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>('Flat');
    
    // Fetch unlisted assets
    const flats = DataService.getFlats().filter(f => !f.is_listed);
    const vehicles = DataService.getVehicles().filter(v => !v.is_listed);
    const gadgets = DataService.getGadgets().filter(g => !g.is_listed);

    const handlePost = () => {
        if (selectedId) {
            DataService.toggleListing(selectedId, selectedType as any, true);
            navigate('/marketplace/manage');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="bg-white p-5 border-b border-gray-100 sticky top-0 z-40 flex justify-between items-center">
                <button onClick={() => step === 1 ? navigate(-1) : setStep(1)}><ChevronLeft size={24}/></button>
                <h2 className="font-bold text-lg">Post to Marketplace</h2>
                <div className="w-6"/>
            </div>

            <div className="flex-1 p-5 overflow-y-auto">
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-xl text-gray-900 mb-1">Select Asset</h3>
                            <p className="text-sm text-gray-500">Choose an item from your inventory to list.</p>
                        </div>

                        {/* List Groups */}
                        <div className="space-y-4">
                            {flats.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Properties</h4>
                                    {flats.map(f => (
                                        <div key={f.id} onClick={() => { setSelectedId(f.id); setSelectedType('Flat'); setStep(2); }} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center mb-2 cursor-pointer hover:border-[#ff4b9a]">
                                            <div><h5 className="font-bold text-gray-900">Flat {f.flat_no}</h5><p className="text-xs text-gray-500">{f.size_sqft} sqft • {f.floor_no}th Floor</p></div>
                                            <ChevronRight size={16} className="text-gray-300"/>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {vehicles.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vehicles</h4>
                                    {vehicles.map(v => (
                                        <div key={v.id} onClick={() => { setSelectedId(v.id); setSelectedType('Vehicle'); setStep(2); }} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center mb-2 cursor-pointer hover:border-[#ff4b9a]">
                                            <div><h5 className="font-bold text-gray-900">{v.name}</h5><p className="text-xs text-gray-500">{v.license_plate}</p></div>
                                            <ChevronRight size={16} className="text-gray-300"/>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {flats.length === 0 && vehicles.length === 0 && gadgets.length === 0 && (
                                <div className="text-center py-20">
                                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4"/>
                                    <p className="text-gray-500 font-medium mb-4">No unlisted assets found.</p>
                                    <button onClick={() => navigate('/myspace/inventory/select-type')} className="bg-[#2d1b4e] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg">Add to Inventory</button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-lg text-gray-900 mb-4">Listing Settings</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1.5 block">Rent Start Date</label>
                                    <input type="date" className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" defaultValue={new Date().toISOString().slice(0, 10)}/>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="font-bold text-gray-700">Negotiable?</span>
                                    <div className="w-12 h-7 bg-[#ff4b9a] rounded-full p-1"><div className="w-5 h-5 bg-white rounded-full translate-x-5 shadow-sm"/></div>
                                </div>
                            </div>
                        </div>
                        <button onClick={handlePost} className="w-full py-4 bg-[#ff4b9a] text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
                            Post as TO-LET
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
