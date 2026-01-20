
import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingBag, MapPin, Star, Building2, Car, Camera, Briefcase, Calendar, ChevronLeft, ChevronRight, Share2, Heart, Phone, Mail, CheckCircle2, Clock, Plus, ArrowRight, User, X, BedDouble, Bath, Ruler, Fuel, Settings2, ShieldCheck, Eye, EyeOff, LayoutGrid, Zap, Image as ImageIcon, MessageCircle, Edit3, Trash2 } from 'lucide-react';
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

// --- ASSET CARD ---
const AssetCard: React.FC<{ item: any, onClick: () => void, isOwner?: boolean, onEdit?: () => void, onUnlist?: () => void }> = ({ item, onClick, isOwner, onEdit, onUnlist }) => {
    const isFlat = item.assetType === 'Residential';
    const isVehicle = item.assetType === 'Vehicle';
    const isGadget = item.assetType === 'Gadget';

    return (
        <div 
            onClick={onClick}
            className="group bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.98] flex flex-col h-full hover:-translate-y-1 relative"
        >
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-3 py-1 bg-white/95 backdrop-blur-md rounded-full text-[10px] font-extrabold text-gray-900 uppercase tracking-wide shadow-sm flex items-center gap-1">
                        {item.category}
                    </span>
                </div>
                {isOwner && (
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} 
                            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 shadow-sm"
                        >
                            <Edit3 size={14} />
                        </button>
                    </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent pt-10">
                    <div className="flex items-center gap-1 text-[11px] text-white font-medium">
                        <MapPin size={12} className="text-[#ff4b9a]"/> {item.city || item.location || 'Dhaka'}
                    </div>
                </div>
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-1 mb-1 group-hover:text-[#ff4b9a] transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-2 text-gray-500 text-xs font-medium">
                        {isFlat && item.details && (
                            <>
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><BedDouble size={12}/> {item.details.bedrooms} Bed</span>
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Ruler size={12}/> {item.details.size} sqft</span>
                            </>
                        )}
                        {isVehicle && item.details && (
                            <>
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Fuel size={12}/> {item.details.fuel}</span>
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md"><Settings2 size={12}/> {item.details.transmission}</span>
                            </>
                        )}
                        {isGadget && item.details && (
                            <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">{item.details.brand} {item.details.model}</span>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-gray-50 mt-3">
                    <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Rent</span>
                        <div className="flex items-baseline gap-1">
                            <p className="text-lg font-black text-gray-900">{item.displayPrice}</p>
                            <span className="text-[10px] font-bold text-gray-400">{item.period || ''}</span>
                        </div>
                    </div>
                    {isOwner && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onUnlist && onUnlist(); }}
                            className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded hover:bg-red-100"
                        >
                            Unlist
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
    <div className="min-h-screen bg-gray-50 pb-28">
        <div className="bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-sm border-b border-gray-200 transition-all duration-300">
            <div className="max-w-7xl mx-auto w-full px-5 md:px-8 py-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center justify-between w-full md:w-auto">
                         <div className="flex items-center gap-3">
                            <div className="md:hidden"><Logo size="sm" /></div>
                            <h2 className="text-xl font-bold text-gray-900">Marketplace</h2>
                        </div>
                        <div className="flex gap-2 md:hidden">
                            <button onClick={() => navigate('manage')} className="bg-gray-100 p-2 rounded-full"><User size={20}/></button>
                            <button onClick={handlePostAd} className="flex items-center gap-2 bg-[#2d1b4e] text-white px-4 py-2 rounded-full shadow-lg active:scale-95 transition-all"><Plus size={16} /><span className="text-xs font-bold uppercase tracking-wide">Post</span></button>
                        </div>
                    </div>
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-11 pr-4 py-3 bg-gray-100 border-transparent rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff4b9a]/20 focus:bg-white focus:border-gray-200 transition-all placeholder:text-gray-400"/>
                    </div>
                    <div className="hidden md:flex gap-3">
                        <button onClick={() => navigate('manage')} className="px-5 py-2.5 rounded-full border border-gray-200 font-bold text-sm hover:bg-gray-50 text-gray-700">My Listings</button>
                        <button onClick={handlePostAd} className="flex items-center gap-2 bg-[#2d1b4e] text-white px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-all hover:bg-[#3d2566] hover:shadow-xl"><Plus size={18} /><span className="text-xs font-bold uppercase tracking-wide">Post Ad</span></button>
                    </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                        { id: 'All', icon: null }, { id: 'Real Estate', icon: Building2 }, { id: 'Vehicles', icon: Car },
                        { id: 'Tech', icon: Camera }, { id: 'Events', icon: Calendar }, { id: 'Services', icon: Briefcase }
                    ].map(cat => (
                        <button key={cat.id} onClick={() => setActiveTab(cat.id as any)} className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap text-xs font-bold transition-all border ${activeTab === cat.id ? 'bg-[#ff4b9a] border-[#ff4b9a] text-white shadow-md shadow-pink-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
                            {cat.icon && <cat.icon size={14} />}{cat.id}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <div className="max-w-7xl mx-auto p-5 md:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredItems.map((item, i) => <AssetCard key={i} item={item} onClick={() => navigate(`item/${item.id}`)} />)}
        </div>
    </div>
  );
};

// --- MY LISTINGS ---
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
        // Map to inventory config route based on type
        if(item.assetType === 'Residential' && item.flat_no) {
            navigate('/myspace/inventory/config-flat', { state: { editId: item.id, buildingId: item.building_id } });
        } else if (item.assetType === 'Vehicle') {
            navigate('/myspace/inventory/config-vehicle', { state: { editId: item.id } }); // Note: Need to implement edit loading in Inventory for Vehicle
        } else {
            alert("Edit for this type coming soon. Use Inventory to manage.");
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

// --- ITEM DETAILS ---
const ItemDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // Simplified fetch logic for demo - iterates all arrays
    const item = DataService.getMarketplaceItems().find(i => i.id === id) as any;
    const currentUser = UserService.getCurrentUser();

    if (!item) return <div>Item not found</div>;

    const isFlat = item.assetType === 'Residential';
    const isOwner = item.user_id === currentUser.id;

    const handleRequest = () => {
        if (!isAuth()) {
            navigate('/login');
            return;
        }
        // Start a chat
        ChatService.startChat(item.user_id, `Hi, I am interested in your ${item.name}. Is it available?`);
        navigate('/inbox');
    };

    return (
        <div className="min-h-screen bg-white pb-32 animate-in slide-in-from-bottom duration-300">
            <div className="relative h-72 md:h-96">
                <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa'} className="w-full h-full object-cover" />
                <button onClick={() => navigate(-1)} className="absolute top-5 left-5 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><ChevronLeft size={24}/></button>
                <button className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all"><Heart size={20}/></button>
            </div>
            
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="text-[#ff4b9a] font-bold text-xs uppercase tracking-wider mb-2 block">{item.category}</span>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{item.name}</h1>
                        <p className="text-gray-500 flex items-center gap-2"><MapPin size={16}/> {item.location || item.city}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-gray-900">{item.displayPrice}</p>
                        <p className="text-xs text-gray-400 font-bold uppercase">{item.period}</p>
                    </div>
                </div>

                {isFlat && item.details && (
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100"><BedDouble size={24} className="mx-auto mb-2 text-gray-400"/><p className="font-bold text-gray-900">{item.details.bedrooms} Bed</p></div>
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100"><Bath size={24} className="mx-auto mb-2 text-gray-400"/><p className="font-bold text-gray-900">{item.details.washrooms} Bath</p></div>
                        <div className="bg-gray-50 p-4 rounded-2xl text-center border border-gray-100"><Ruler size={24} className="mx-auto mb-2 text-gray-400"/><p className="font-bold text-gray-900">{item.details.size} sqft</p></div>
                    </div>
                )}

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                        <p className="text-gray-600 leading-relaxed text-sm">
                            {item.listing_description || item.description || "No description provided. Contact the owner for more details."}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Amenities & Features</h3>
                        <div className="flex flex-wrap gap-2">
                            {(item.amenities || ['Verified', 'Secure', 'Available']).map((a: string) => (
                                <span key={a} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">{a}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] safe-bottom z-40">
                <div className="max-w-4xl mx-auto flex gap-4">
                    {isOwner ? (
                        <button onClick={() => navigate('/myspace/inventory')} className="flex-1 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                            Manage in Inventory
                        </button>
                    ) : (
                        <>
                            <button onClick={() => window.location.href = `tel:123`} className="px-6 py-4 bg-gray-100 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"><Phone size={20}/></button>
                            <button onClick={handleRequest} className="flex-1 py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2">
                                <MessageCircle size={20}/> Request to Rent
                            </button>
                        </>
                    )}
                </div>
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
