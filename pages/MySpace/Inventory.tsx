
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Plus, MapPin, Building2, Store, Briefcase, Users, Car, Scissors, ChevronRight, ChevronLeft, Minus, Trash2, AlertTriangle, MoreHorizontal, ArrowLeft, Home, Layers, CheckCircle2, LayoutGrid, DollarSign, BedDouble, Bath, Wind, Utensils, Armchair, Flame, Upload, UserPlus, Calendar, Send, Settings, PenTool, Zap, Shield, Warehouse, Camera, Bus, Truck, Bike, Ship, Edit3, X, User, Phone, Wifi, Video, Lock, Info, Compass, Droplets, Mic2, Star, CheckSquare, Tv, Grid, Fuel, Settings2, Monitor, Gamepad, Headphones, Music, FileText, Link, MousePointerClick, MessageSquare } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { CITIES, AREAS } from '../../constants';
import { Building, Flat, Tenant, AssetType, Vehicle, Gadget, RentCycle, ServiceAsset } from '../../types';

// --- Reusable UI Components ---

const Header: React.FC<{ 
    title: string; 
    subtitle?: string; 
    showBack?: boolean; 
    onBack?: () => void;
    action?: React.ReactNode;
}> = ({ title, subtitle, showBack, onBack, action }) => {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 py-4 flex items-center justify-between transition-all">
            <div className="flex items-center gap-3">
                {showBack && (
                    <button 
                        onClick={onBack || (() => navigate(-1))} 
                        className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 border border-transparent hover:border-gray-200 flex items-center justify-center text-gray-700 transition-all active:scale-95"
                    >
                        <ChevronLeft size={22} />
                    </button>
                )}
                <div>
                    <h1 className="text-lg font-bold text-gray-900 leading-tight">{title}</h1>
                    {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
                </div>
            </div>
            {action}
        </div>
    );
};

const StepIndicator: React.FC<{ current: number, total: number }> = ({ current, total }) => (
    <div className="flex items-center justify-center gap-2 mb-6">
        {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= current ? 'w-8 bg-[#ff4b9a]' : 'w-2 bg-gray-200'}`} />
        ))}
    </div>
);

const InputGroup: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="text-xs font-bold text-gray-500 mb-1.5 block">{label}</label>
        {children}
    </div>
);

// New Reusable Booking Type Selector
const BookingTypeSelector: React.FC<{ value: 'instant' | 'request' | undefined, onChange: (val: 'instant' | 'request') => void }> = ({ value, onChange }) => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">Booking Preference</h3>
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => onChange('instant')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${value === 'instant' ? 'border-[#ff4b9a] bg-pink-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${value === 'instant' ? 'bg-[#ff4b9a] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <MousePointerClick size={16}/>
                    </div>
                    <span className="block text-sm font-bold text-gray-900">Instant Book</span>
                    <span className="text-[10px] text-gray-500 leading-tight mt-1 block">Renters book directly without approval.</span>
                </button>

                <button 
                    onClick={() => onChange('request')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${value === 'request' ? 'border-[#ff4b9a] bg-pink-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${value === 'request' ? 'bg-[#ff4b9a] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        <MessageSquare size={16}/>
                    </div>
                    <span className="block text-sm font-bold text-gray-900">Request Only</span>
                    <span className="text-[10px] text-gray-500 leading-tight mt-1 block">Renters must contact you first.</span>
                </button>
            </div>
        </div>
    );
};

// --- ASSET LIST VIEW ---
const AssetList: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>(DataService.getBuildings());
  const [vehicles, setVehicles] = useState<Vehicle[]>(DataService.getVehicles());
  const [gadgets, setGadgets] = useState<Gadget[]>(DataService.getGadgets());
  const [services, setServices] = useState<ServiceAsset[]>(DataService.getServices());

  const [activeTab, setActiveTab] = useState<'All' | 'Property' | 'Vehicle' | 'Gadget' | 'Service'>('All');

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      <Header 
        title="Inventory" 
        subtitle="Manage assets & listings"
        action={
            <button onClick={() => navigate('select-type')} className="flex items-center gap-2 bg-[#2d1b4e] text-white px-4 py-2 rounded-xl shadow-[0_4px_14px_rgba(45,27,78,0.3)] active:scale-95 transition-all">
                <Plus size={18} strokeWidth={2.5} /> <span className="text-xs font-bold">Add</span>
            </button>
        }
      />
      
      {/* Filter Tabs */}
      <div className="px-5 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {['All', 'Property', 'Vehicle', 'Gadget', 'Service'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)} 
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeTab === tab ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="p-5 space-y-4">
          {/* Properties */}
          {(activeTab === 'All' || activeTab === 'Property') && buildings.map(b => (
              <div key={b.id} onClick={() => navigate(`manage-flats/${b.id}`)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer active:scale-[0.99] transition-transform">
                  <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                              <Building2 size={24} />
                          </div>
                          <div>
                              <h3 className="font-bold text-gray-900">{b.name}</h3>
                              <p className="text-xs text-gray-500">{b.area}, {b.city}</p>
                              <div className="flex gap-2 mt-2">
                                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded font-bold text-gray-600">{b.flat_count} Flats</span>
                                  <span className="text-[10px] bg-green-50 px-2 py-0.5 rounded font-bold text-green-600">{b.occupied_count} Occupied</span>
                              </div>
                          </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-300" />
                  </div>
              </div>
          ))}

          {/* Vehicles */}
          {(activeTab === 'All' || activeTab === 'Vehicle') && vehicles.map(v => (
              <div key={v.id} onClick={() => navigate(`config-vehicle`, { state: { editId: v.id } })} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:scale-[0.98]">
                  <div className="flex gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                          <Car size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900">{v.name}</h3>
                          <p className="text-xs text-gray-500">{v.license_plate}</p>
                          <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold inline-block ${v.status === 'rented' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                  {v.status === 'rented' ? 'Rented' : 'Available'}
                              </span>
                              {v.booking_type === 'instant' && <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#ff4b9a]/10 text-[#ff4b9a] flex items-center gap-1"><Zap size={8}/> Instant</span>}
                          </div>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-sm font-bold">৳{v.rates['Daily']}/day</p>
                  </div>
              </div>
          ))}

          {/* Gadgets */}
          {(activeTab === 'All' || activeTab === 'Gadget') && gadgets.map(g => (
              <div key={g.id} onClick={() => navigate(`config-gadget`, { state: { editId: g.id } })} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:scale-[0.98]">
                  <div className="flex gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                          <Camera size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900">{g.name}</h3>
                          <p className="text-xs text-gray-500">{g.brand} {g.model}</p>
                          <div className="flex items-center gap-2 mt-1">
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold inline-block ${g.status === 'rented' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                                  {g.status}
                              </span>
                              {g.booking_type === 'instant' && <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#ff4b9a]/10 text-[#ff4b9a] flex items-center gap-1"><Zap size={8}/> Instant</span>}
                          </div>
                      </div>
                  </div>
                  <div className="text-right">
                      <p className="text-sm font-bold">৳{g.rates['Daily']}/day</p>
                  </div>
              </div>
          ))}
          
          {/* Services */}
          {(activeTab === 'All' || activeTab === 'Service') && services.map(s => (
              <div key={s.id} onClick={() => navigate(`config-service`, { state: { editId: s.id } })} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:scale-[0.98]">
                  <div className="flex gap-4">
                      <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600">
                          <Briefcase size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900">{s.name}</h3>
                          <p className="text-xs text-gray-500">{s.category}</p>
                      </div>
                  </div>
              </div>
          ))}

          {/* Empty State */}
          {buildings.length === 0 && vehicles.length === 0 && gadgets.length === 0 && services.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                  <Warehouse size={48} className="mx-auto mb-3 opacity-20"/>
                  <p>Your inventory is empty.</p>
              </div>
          )}
      </div>
    </div>
  );
};

// --- SELECT TYPE ---
const SelectType: React.FC = () => {
    const navigate = useNavigate();
    const types = [
        { label: 'Building', sub: 'Apartments, Hostels', icon: Building2, path: '/myspace/inventory/config-building', color: 'text-blue-600 bg-blue-50' },
        { label: 'Vehicle', sub: 'Cars, Bikes, Trucks', icon: Car, path: '/myspace/inventory/config-vehicle', color: 'text-indigo-600 bg-indigo-50' },
        { label: 'Gadget', sub: 'Cameras, Laptops', icon: Camera, path: '/myspace/inventory/config-gadget', color: 'text-purple-600 bg-purple-50' },
        { label: 'Service', sub: 'Photography, Event', icon: Briefcase, path: '/myspace/inventory/config-service', color: 'text-pink-600 bg-pink-50' },
    ];
    return (
        <div className="min-h-screen bg-white">
            <Header title="Add to Inventory" showBack/>
            <div className="p-6 grid grid-cols-1 gap-4">
                {types.map((t, i) => (
                    <button key={i} onClick={() => navigate(t.path)} className="p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 text-left hover:border-gray-300 hover:shadow-md transition-all active:scale-[0.98]">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${t.color}`}>
                            <t.icon size={28}/>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">{t.label}</h3>
                            <p className="text-sm text-gray-500">{t.sub}</p>
                        </div>
                        <div className="ml-auto bg-gray-50 p-2 rounded-full text-gray-400">
                            <ChevronRight size={20}/>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    )
}

// --- BUILDING CONFIGURATION ---
const BuildingConfig: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<Building>>({
        name: '', city: 'Dhaka', area: '', address: '', floors: 6, amenities: [], listing_description: ''
    });

    const handleSave = () => {
        if(formData.name && formData.area) {
            DataService.addBuilding(formData as Building);
            navigate('/myspace/inventory');
        }
    };

    const toggleAmenity = (a: string) => {
        const list = formData.amenities?.includes(a) 
            ? formData.amenities.filter(x => x !== a) 
            : [...(formData.amenities || []), a];
        setFormData({ ...formData, amenities: list });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title="Add Building" showBack />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <InputGroup label="Property Name">
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none focus:border-[#ff4b9a]" placeholder="e.g. Dream Heights"/>
                    </InputGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="City">
                            <select value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none">
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </InputGroup>
                        <InputGroup label="Total Floors">
                            <input type="number" value={formData.floors} onChange={e => setFormData({...formData, floors: parseInt(e.target.value)})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none"/>
                        </InputGroup>
                    </div>
                    <InputGroup label="Area / Neighborhood">
                        <input type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" placeholder="e.g. Uttara Sector 4"/>
                    </InputGroup>
                    <InputGroup label="Full Address">
                        <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" rows={3} placeholder="House, Road, Block..."/>
                    </InputGroup>
                    <InputGroup label="Short Description">
                        <textarea value={formData.listing_description} onChange={e => setFormData({...formData, listing_description: e.target.value})} className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 font-bold outline-none" rows={2} placeholder="Quiet residential area..."/>
                    </InputGroup>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4">Facilities & Security</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {['Lift', 'Generator', 'Gas', 'CCTV', 'Guard', 'WiFi', 'Parking', 'Fire Safety', 'Gym'].map(item => (
                            <button 
                                key={item} 
                                onClick={() => toggleAmenity(item)}
                                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${formData.amenities?.includes(item) ? 'bg-[#ff4b9a] text-white border-[#ff4b9a]' : 'bg-gray-50 text-gray-500 border-transparent'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">Create Building</button>
            </div>
        </div>
    );
};

// --- MANAGE FLATS ---
const ManageFlats: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const building = DataService.getBuildingById(id!);
    const flats = DataService.getFlats(id);

    if (!building) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <div className="bg-white sticky top-0 z-40 border-b border-gray-100">
                <Header title={building.name} subtitle={`${building.area} • ${flats.length} Units`} showBack/>
            </div>
            
            <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Unit List</h3>
                    <button 
                        onClick={() => navigate('/myspace/inventory/config-flat', { state: { buildingId: id } })}
                        className="bg-[#ff4b9a] text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md active:scale-95"
                    >
                        <Plus size={14}/> Add Flat
                    </button>
                </div>

                <div className="space-y-3">
                    {flats.map(flat => (
                        <div key={flat.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">Flat {flat.flat_no}</h4>
                                <p className="text-xs text-gray-500">{flat.floor_no}th Floor • {flat.size_sqft} sqft</p>
                                <p className="text-xs font-bold text-gray-900 mt-1">৳ {flat.monthly_rent.toLocaleString()}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${flat.is_vacant ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {flat.is_vacant ? 'Vacant' : 'Occupied'}
                                </span>
                                <button 
                                    onClick={() => navigate('/myspace/inventory/config-flat', { state: { buildingId: id, editId: flat.id } })}
                                    className="p-2 bg-gray-50 rounded-full text-gray-500 hover:text-[#ff4b9a] hover:bg-pink-50 transition-colors"
                                >
                                    <Settings2 size={16}/>
                                </button>
                            </div>
                        </div>
                    ))}
                    {flats.length === 0 && (
                        <div className="text-center py-10 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200">
                            <p>No flats added yet.</p>
                            <button onClick={() => navigate('/myspace/inventory/config-flat', { state: { buildingId: id } })} className="text-[#ff4b9a] font-bold text-sm mt-2">Add First Flat</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- FLAT CONFIGURATION (Consolidated) ---
const FlatConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buildingId = location.state?.buildingId;
    const editId = location.state?.editId;
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<Flat> & { amenities: string[], list_on_marketplace: boolean }>({
        building_id: buildingId,
        flat_no: '', floor_no: 1, bedrooms: 3, washrooms: 2, balconies: 2, size_sqft: 1200,
        monthly_rent: 0, service_charge: 0, gas_bill: 0, water_bill: 0, rent_type: 'Monthly',
        is_vacant: true, amenities: [], facing: 'South', furnishing: 'Unfurnished', list_on_marketplace: false, booking_type: 'request'
    });

    useEffect(() => {
        if(editId) {
            const f = DataService.getFlatById(editId);
            if(f) setFormData({ ...f, amenities: f.amenities || [], list_on_marketplace: f.is_listed || false });
        }
    }, [editId]);

    const update = (k: string, v: any) => setFormData(p => ({...p, [k]: v}));
    const toggleAmenity = (a: string) => setFormData(p => ({ ...p, amenities: p.amenities.includes(a) ? p.amenities.filter(x => x !== a) : [...p.amenities, a] }));
    const save = () => {
        if(formData.flat_no && formData.monthly_rent) {
            const payload = { ...formData, is_listed: formData.list_on_marketplace };
            editId ? DataService.updateFlat(editId, payload) : DataService.addFlat(payload);
            navigate(-1);
        }
    };

    const Counter = ({ label, value, onChange }: any) => (
        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
            <span className="text-sm font-bold text-gray-700">{label}</span>
            <div className="flex items-center gap-3">
                <button onClick={() => onChange(Math.max(0, value - 1))} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"><Minus size={16}/></button>
                <span className="font-bold w-4 text-center">{value}</span>
                <button onClick={() => onChange(value + 1)} className="w-8 h-8 bg-[#2d1b4e] text-white rounded-full flex items-center justify-center"><Plus size={16}/></button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={editId ? `Edit ${formData.flat_no}` : 'Configure Flat'} showBack subtitle={`Step ${step} of 3`}/>
            <div className="flex-1 p-6 pb-32 space-y-6 overflow-y-auto">
                <StepIndicator current={step} total={3} />
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2"><LayoutGrid size={18}/> Structure</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Flat No"><input type="text" value={formData.flat_no} onChange={e => update('flat_no', e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" placeholder="4A"/></InputGroup>
                                <InputGroup label="Floor"><input type="number" value={formData.floor_no} onChange={e => update('floor_no', parseInt(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/></InputGroup>
                            </div>
                            <InputGroup label="Size (Sqft)"><input type="number" value={formData.size_sqft} onChange={e => update('size_sqft', parseInt(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/></InputGroup>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-3">
                            <Counter label="Bedrooms" value={formData.bedrooms} onChange={(v:any) => update('bedrooms', v)} />
                            <Counter label="Bathrooms" value={formData.washrooms} onChange={(v:any) => update('washrooms', v)} />
                            <Counter label="Balconies" value={formData.balconies} onChange={(v:any) => update('balconies', v)} />
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2"><Armchair size={18}/> Features</h3>
                            <div className="grid grid-cols-1 gap-2">
                                {['Unfurnished', 'Semi-Furnished', 'Fully-Furnished'].map(f => (
                                    <button key={f} onClick={() => update('furnishing', f)} className={`p-3 rounded-xl border flex justify-between ${formData.furnishing === f ? 'border-[#ff4b9a] bg-pink-50' : 'border-gray-200'}`}><span className="font-bold text-sm">{f}</span>{formData.furnishing === f && <CheckCircle2 size={16} className="text-[#ff4b9a]"/>}</button>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-3">Amenities</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    {id: 'Wifi', icon: Wifi}, {id: 'Gas', icon: Flame}, {id: 'CCTV', icon: Video},
                                    {id: 'Lift', icon: ArrowLeft}, {id: 'Generator', icon: Zap}, {id: 'AC', icon: Wind}
                                ].map(i => (
                                    <button key={i.id} onClick={() => toggleAmenity(i.id)} className={`p-3 rounded-xl border flex flex-col items-center gap-1 ${formData.amenities.includes(i.id) ? 'bg-[#ff4b9a] text-white border-[#ff4b9a]' : 'bg-gray-50 text-gray-500 border-transparent'}`}>
                                        <i.icon size={20}/> <span className="text-[10px] font-bold">{i.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2"><DollarSign size={18}/> Monthly Rent</h3>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                                <input type="number" value={formData.monthly_rent} onChange={e => update('monthly_rent', parseInt(e.target.value))} className="w-full pl-8 p-4 bg-gray-50 rounded-xl font-bold text-xl outline-none"/>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <InputGroup label="Service Charge"><input type="number" value={formData.service_charge} onChange={e => update('service_charge', parseInt(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/></InputGroup>
                                <InputGroup label="Water Bill"><input type="number" value={formData.water_bill} onChange={e => update('water_bill', parseInt(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/></InputGroup>
                            </div>
                        </div>
                        
                        <BookingTypeSelector value={formData.booking_type} onChange={val => update('booking_type', val)} />

                        <div className="bg-pink-50 p-6 rounded-3xl border border-pink-100 flex justify-between items-center">
                            <div><h4 className="font-bold">List on Marketplace</h4><p className="text-xs text-gray-500">Post ad immediately</p></div>
                            <button onClick={() => update('list_on_marketplace', !formData.list_on_marketplace)} className={`w-12 h-7 rounded-full p-1 transition-colors ${formData.list_on_marketplace ? 'bg-[#ff4b9a]' : 'bg-gray-300'}`}><div className={`w-5 h-5 bg-white rounded-full transition-transform ${formData.list_on_marketplace ? 'translate-x-5' : ''}`}/></button>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom flex gap-3">
                {step > 1 && <button onClick={() => setStep(s => s-1)} className="px-6 py-3 bg-gray-100 font-bold rounded-xl">Back</button>}
                <button onClick={() => step < 3 ? setStep(s => s+1) : save()} className="flex-1 py-3 bg-[#2d1b4e] text-white font-bold rounded-xl shadow-lg">{step < 3 ? 'Next' : 'Save Flat'}</button>
            </div>
        </div>
    );
};

// --- VEHICLE CONFIGURATION ---
const VehicleConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editId = location.state?.editId;
    const [formData, setFormData] = useState<Partial<Vehicle>>({
        name: '', type: 'Car', transmission: 'Auto', fuel_type: 'CNG', seats: 4, rates: { 'Daily': 3000 }, license_plate: '', model_year: '2019', color: '', booking_type: 'request'
    });

    useEffect(() => {
        if(editId) {
            const v = DataService.getVehicleById(editId);
            if(v) setFormData(v);
        }
    }, [editId]);

    const handleSave = () => {
        if(formData.name && formData.license_plate) {
            editId ? DataService.updateVehicle(editId, formData) : DataService.addVehicle({ ...formData, status: 'active', is_listed: true } as Vehicle);
            navigate('/myspace/inventory');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={editId ? 'Edit Vehicle' : 'Add Vehicle'} showBack />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <InputGroup label="Vehicle Name"><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" placeholder="e.g. Toyota Axio 2018"/></InputGroup>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['Car', 'Bike', 'Bus', 'Truck'].map(t => (
                            <button key={t} onClick={() => setFormData({...formData, type: t})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.type === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>{t}</button>
                        ))}
                    </div>
                    <InputGroup label="License Plate"><input type="text" value={formData.license_plate} onChange={e => setFormData({...formData, license_plate: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" placeholder="DHAKA-METRO-GA..."/></InputGroup>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-900">Specs Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Model Year"><input type="number" value={formData.model_year} onChange={e => setFormData({...formData, model_year: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/></InputGroup>
                        <InputGroup label="Color"><input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" placeholder="e.g. Pearl White"/></InputGroup>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Transmission">
                            <select value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value as any})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none">
                                <option>Auto</option><option>Manual</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="Fuel Type">
                            <select value={formData.fuel_type} onChange={e => setFormData({...formData, fuel_type: e.target.value as any})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none">
                                <option>CNG</option><option>Petrol</option><option>Diesel</option><option>Hybrid</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="Seats"><input type="number" value={formData.seats} onChange={e => setFormData({...formData, seats: parseInt(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/></InputGroup>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <h3 className="font-bold text-gray-900">Rate (Daily)</h3>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">৳</span>
                        <input type="number" value={formData.rates?.['Daily']} onChange={e => setFormData({...formData, rates: { ...formData.rates, 'Daily': parseInt(e.target.value) }})} className="w-full pl-8 p-4 bg-gray-50 rounded-xl font-bold text-xl outline-none"/>
                    </div>
                </div>

                <BookingTypeSelector value={formData.booking_type} onChange={val => setFormData({...formData, booking_type: val})} />
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">Save Vehicle</button>
            </div>
        </div>
    );
};

// --- GADGET CONFIGURATION ---
const GadgetConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editId = location.state?.editId;
    const [formData, setFormData] = useState<Partial<Gadget>>({
        name: '', category: 'Camera', brand: '', model: '', rates: { 'Daily': 500 }, security_deposit: 0, serial_no: '', booking_type: 'request'
    });

    useEffect(() => {
        if(editId) {
            const g = DataService.getGadgetById(editId);
            if(g) setFormData(g);
        }
    }, [editId]);

    const handleSave = () => {
        if(formData.name) {
            editId ? DataService.updateGadget(editId, formData) : DataService.addGadget({ ...formData, status: 'active', is_listed: true } as Gadget);
            navigate('/myspace/inventory');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={editId ? 'Edit Gadget' : 'Add Gadget'} showBack />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <InputGroup label="Item Name"><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" placeholder="e.g. Sony A7III Kit"/></InputGroup>
                    <div className="grid grid-cols-3 gap-3">
                        {[{l:'Camera', i: Camera}, {l:'Console', i: Gamepad}, {l:'Audio', i: Headphones}].map(c => (
                            <button key={c.l} onClick={() => setFormData({...formData, category: c.l})} className={`p-3 rounded-xl border flex flex-col items-center ${formData.category === c.l ? 'bg-[#ff4b9a] text-white border-[#ff4b9a]' : 'bg-gray-50 border-transparent'}`}>
                                <c.i size={20}/> <span className="text-[10px] font-bold mt-1">{c.l}</span>
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Brand"><input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/></InputGroup>
                        <InputGroup label="Model"><input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/></InputGroup>
                    </div>
                    <InputGroup label="Serial No (Optional)"><input type="text" value={formData.serial_no} onChange={e => setFormData({...formData, serial_no: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" placeholder="S/N: XXXXX"/></InputGroup>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="Daily Rate (৳)">
                            <input type="number" value={formData.rates?.['Daily']} onChange={e => setFormData({...formData, rates: { ...formData.rates, 'Daily': parseInt(e.target.value) }})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/>
                        </InputGroup>
                        <InputGroup label="Security Deposit (৳)">
                            <input type="number" value={formData.security_deposit} onChange={e => setFormData({...formData, security_deposit: parseInt(e.target.value)})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/>
                        </InputGroup>
                    </div>
                </div>
                <BookingTypeSelector value={formData.booking_type} onChange={val => setFormData({...formData, booking_type: val})} />
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">Save Gadget</button>
            </div>
        </div>
    );
};

// --- SERVICE CONFIGURATION ---
const ServiceConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editId = location.state?.editId;
    const [formData, setFormData] = useState<Partial<ServiceAsset>>({
        name: '', category: 'Photographer', rates: { 'Daily': 2000 }, description: '', booking_type: 'request'
    });

    useEffect(() => {
        if(editId) {
            const s = DataService.getServiceById(editId);
            if(s) setFormData(s);
        }
    }, [editId]);

    const handleSave = () => {
        if(formData.name) {
            editId ? DataService.updateService(editId, formData) : DataService.addService({ ...formData, status: 'active', is_listed: true } as ServiceAsset);
            navigate('/myspace/inventory');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header title={editId ? 'Edit Service' : 'Add Service'} showBack />
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <InputGroup label="Service Title"><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" placeholder="e.g. Wedding Photography"/></InputGroup>
                    <InputGroup label="Category">
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none">
                            <option>Photographer</option><option>Event Planner</option><option>Shift/Movers</option><option>Technician</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="Description/Bio">
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none" rows={3} placeholder="Describe your experience..."/>
                    </InputGroup>
                    <InputGroup label="Starting Rate (৳)">
                        <input type="number" value={formData.rates?.['Daily']} onChange={e => setFormData({...formData, rates: { ...formData.rates, 'Daily': parseInt(e.target.value) }})} className="w-full p-3 bg-gray-50 rounded-xl font-bold outline-none"/>
                    </InputGroup>
                </div>
                <BookingTypeSelector value={formData.booking_type} onChange={val => setFormData({...formData, booking_type: val})} />
            </div>
            <div className="p-5 bg-white border-t border-gray-100 safe-bottom">
                <button onClick={handleSave} className="w-full py-4 bg-[#2d1b4e] text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform">Save Service</button>
            </div>
        </div>
    );
};

// ... (Inventory Router Component)
const Inventory: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AssetList />} />
      <Route path="select-type" element={<SelectType />} />
      <Route path="manage-flats/:id" element={<ManageFlats />} />
      <Route path="config-flat" element={<FlatConfig />} />
      <Route path="config-building" element={<BuildingConfig />} />
      <Route path="config-vehicle" element={<VehicleConfig />} />
      <Route path="config-gadget" element={<GadgetConfig />} />
      <Route path="config-service" element={<ServiceConfig />} />
    </Routes>
  );
};

export default Inventory;
