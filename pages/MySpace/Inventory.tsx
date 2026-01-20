
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Plus, MapPin, Building2, Store, Briefcase, Users, Car, Scissors, ChevronRight, ChevronLeft, Minus, Trash2, AlertTriangle, MoreHorizontal, ArrowLeft, Home, Layers, CheckCircle2, LayoutGrid, DollarSign, BedDouble, Bath, Wind, Utensils, Armchair, Flame, Upload, UserPlus, Calendar, Send, Settings, PenTool, Zap, Shield, Warehouse, Camera, Bus, Truck, Bike, Ship, Edit3, X, User, Phone, Wifi, Video, Lock, Info, Compass, Droplets, Mic2, Star } from 'lucide-react';
import { DataService } from '../../services/mockData';
import { CITIES, AREAS } from '../../constants';
import { Building, Flat, Tenant, AssetType, Vehicle, Gadget, RentCycle, ServiceAsset } from '../../types';

// --- Reusable Components ---

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

const SectionHeader: React.FC<{ title: string, action?: React.ReactNode }> = ({ title, action }) => (
    <div className="flex justify-between items-center px-1 mb-3 mt-6 first:mt-2">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            {title}
        </h3>
        {action}
    </div>
);

// --- Config Layout Wrapper ---
const ConfigLayout: React.FC<{ 
    title: string; 
    onSave: () => void; 
    saveLabel?: string;
    children: React.ReactNode; 
}> = ({ title, onSave, saveLabel = "Save Changes", children }) => {
    return (
        <div className="min-h-screen bg-white pb-32">
             <Header title={title} showBack />
             <div className="p-6">
                {children}
             </div>
             <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 safe-bottom z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                 <button onClick={onSave} className="w-full py-3.5 bg-[#ff4b9a] text-white font-bold rounded-xl shadow-lg shadow-pink-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                     <CheckCircle2 size={20} /> {saveLabel}
                 </button>
             </div>
        </div>
    );
};

// --- Main Asset List ---
const AssetList: React.FC = () => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [gadgets, setGadgets] = useState<Gadget[]>([]);
  const [services, setServices] = useState<ServiceAsset[]>([]);

  useEffect(() => {
    setBuildings(DataService.getBuildings());
    setVehicles(DataService.getVehicles());
    setGadgets(DataService.getGadgets());
    setServices(DataService.getServices());
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header 
        title="My Properties" 
        subtitle="Manage assets & inventory"
        action={
            <button 
                onClick={() => navigate('select-type')}
                className="flex items-center gap-2 bg-[#2d1b4e] text-white px-4 py-2 rounded-xl shadow-[0_4px_14px_rgba(45,27,78,0.3)] active:scale-95 transition-all hover:shadow-[0_6px_20px_rgba(45,27,78,0.4)] hover:-translate-y-0.5"
            >
                <Plus size={18} strokeWidth={2.5} />
                <span className="text-xs font-bold">Add New</span>
            </button>
        }
      />

      <div className="p-5 space-y-8 pb-32">
        {/* Empty State */}
        {buildings.length === 0 && vehicles.length === 0 && gadgets.length === 0 && services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-[2rem] flex items-center justify-center mb-6 text-gray-300 shadow-inner border border-white">
               <Home size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No properties yet</h3>
            <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">Add your first building, vehicle, or gadget to get started.</p>
          </div>
        )}

        {/* Buildings Section */}
        {buildings.length > 0 && (
            <div>
                <SectionHeader title="Real Estate" />
                <div className="space-y-4">
                    {buildings.map((building) => {
                    const occupancyRate = building.flat_count ? Math.round(((building.occupied_count || 0) / building.flat_count) * 100) : 0;
                    
                    return (
                        <div 
                            key={building.id} 
                            onClick={() => navigate(`manage-flats/${building.id}`)}
                            className="group relative bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50/80 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
                            
                            <div className="relative flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                    <Building2 size={26} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight">{building.name}</h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                                        <MapPin size={12} className="text-blue-400" /> {building.area}, {building.city}
                                    </p>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); navigate('config-building', { state: { type: building.type, editId: building.id } }); }}
                                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-gray-100 hover:border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all z-10 shadow-sm"
                                >
                                    <Edit3 size={14} />
                                </button>
                            </div>

                            <div className="mt-5 grid grid-cols-3 gap-2 relative z-10">
                                <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Units</span>
                                    <span className="block text-sm font-extrabold text-gray-900">{building.flat_count}</span>
                                </div>
                                <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Floors</span>
                                    <span className="block text-sm font-extrabold text-gray-900">{building.floors}</span>
                                </div>
                                <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-2.5 text-center border border-gray-100 group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Occupancy</span>
                                    <span className={`block text-sm font-extrabold ${occupancyRate >= 80 ? 'text-green-600' : 'text-gray-900'}`}>{occupancyRate}%</span>
                                </div>
                            </div>
                        </div>
                    );
                    })}
                </div>
            </div>
        )}

        {/* Services Section */}
        {services.length > 0 && (
            <div>
                <SectionHeader title="Services" />
                <div className="space-y-4">
                    {services.map((service) => (
                        <div key={service.id} className="group relative bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-50/80 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
                             
                             <div className="relative flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 text-purple-600 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                    <Briefcase size={26} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight">{service.name}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">{service.category}</p>
                                </div>
                                <button 
                                    onClick={() => navigate('config-service', { state: { editId: service.id } })}
                                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-gray-100 hover:border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all z-10 shadow-sm"
                                >
                                    <Edit3 size={14} />
                                </button>
                             </div>

                             <div className="mt-5 flex gap-2 relative z-10">
                                {Object.keys(service.rates).map(r => (
                                    <div key={r} className="flex-1 bg-gray-50/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-100 group-hover:border-purple-100 group-hover:bg-purple-50/30 transition-all">
                                        <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{r} Rate</span>
                                        <span className="block text-sm font-extrabold text-gray-900">৳ {service.rates[r as RentCycle]}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Vehicles Section */}
        {vehicles.length > 0 && (
            <div>
                <SectionHeader title="Vehicles" />
                <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="group relative bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50/80 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
                            
                            <div className="relative flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                    <Car size={26} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight">{vehicle.name}</h3>
                                    <div className="mt-1">
                                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold font-mono px-2 py-1 rounded-lg border border-gray-200">{vehicle.license_plate}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => navigate('config-vehicle', { state: { editId: vehicle.id } })}
                                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-gray-100 hover:border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all z-10 shadow-sm"
                                >
                                    <Edit3 size={14} />
                                </button>
                            </div>

                            <div className="mt-5 flex items-center justify-between bg-gray-50/80 backdrop-blur-sm rounded-2xl p-3 px-4 border border-gray-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/30 transition-all relative z-10">
                                <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${vehicle.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                     <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{vehicle.status === 'active' ? 'Available' : 'Rented'}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Daily Rate</span>
                                    <span className="block text-sm font-extrabold text-gray-900">৳ {vehicle.rates['Daily'] || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Gadgets Section */}
        {gadgets.length > 0 && (
            <div>
                <SectionHeader title="Equipment" />
                <div className="space-y-4">
                    {gadgets.map((gadget) => (
                         <div key={gadget.id} className="group relative bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50/80 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-500" />
                            
                            <div className="relative flex items-start gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                    <Camera size={26} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 min-w-0 pt-1">
                                    <h3 className="text-lg font-bold text-gray-900 truncate tracking-tight">{gadget.name}</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">{gadget.brand} {gadget.model}</p>
                                </div>
                                <button 
                                    onClick={() => navigate('config-gadget', { state: { editId: gadget.id } })}
                                    className="w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-gray-100 hover:border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all z-10 shadow-sm"
                                >
                                    <Edit3 size={14} />
                                </button>
                            </div>

                            <div className="mt-5 flex items-center justify-between bg-gray-50/80 backdrop-blur-sm rounded-2xl p-3 px-4 border border-gray-100 group-hover:border-orange-100 group-hover:bg-orange-50/30 transition-all relative z-10">
                                <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${gadget.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                                     <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{gadget.status === 'active' ? 'Available' : 'Rented'}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Daily Rate</span>
                                    <span className="block text-sm font-extrabold text-gray-900">৳ {gadget.rates['Daily'] || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

// --- Asset Type Selection ---
const SelectType: React.FC = () => {
  const navigate = useNavigate();
  
  const types = [
    { label: 'Flat / Building', sub: 'Residential', icon: Building2, path: '/myspace/inventory/config-building', type: 'Residential', color: 'text-[#ff4b9a]', bg: 'bg-pink-50' },
    { label: 'Shop / Market', sub: 'Commercial', icon: Store, path: '/myspace/inventory/config-building', type: 'Commercial', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Hostel / Mess', sub: 'Shared Living', icon: Users, path: '/myspace/inventory/config-building', type: 'Shared', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Event Space', sub: 'Party Center, Hall', icon: Calendar, path: '/myspace/inventory/config-service', type: 'Event Space', color: 'text-fuchsia-600', bg: 'bg-fuchsia-50' },
    { label: 'Professional / Skill', sub: 'Photographer, Band', icon: Briefcase, path: '/myspace/inventory/config-service', type: 'Professional', color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'General Service', sub: 'Cleaning, Decor', icon: Mic2, path: '/myspace/inventory/config-service', type: 'Service', color: 'text-lime-600', bg: 'bg-lime-50' },
    { label: 'Vehicles', sub: 'Car, Bike, Truck', icon: Car, path: '/myspace/inventory/config-vehicle', type: 'Vehicle', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Equipment', sub: 'Camera, Tools', icon: Scissors, path: '/myspace/inventory/config-gadget', type: 'Gadget', color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header title="Select Type" subtitle="What kind of asset is this?" showBack />
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {types.map((type, i) => (
            <button 
              key={i} 
              onClick={() => navigate(type.path, { state: { type: type.type } })}
              className="p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 hover:bg-gray-50 active:scale-95 bg-white flex flex-col items-center gap-3 text-center transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-full ${type.bg} flex items-center justify-center mb-1`}>
                <type.icon size={24} strokeWidth={2} className={type.color} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-1">{type.label}</h3>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{type.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceConfig: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const assetType = location.state?.type as AssetType || 'Service';
  const editId = location.state?.editId;

  const [formData, setFormData] = useState<Partial<ServiceAsset>>({
      type: assetType as any,
      rates: { 'Hourly': 0 },
      status: 'active',
      name: '',
      category: '',
      description: '',
      location: ''
  });

  useEffect(() => {
      if(editId) {
          const service = DataService.getServiceById(editId);
          if(service) setFormData(service);
      }
  }, [editId]);

  const updateField = (field: keyof ServiceAsset, value: any) => setFormData(prev => ({...prev, [field]: value}));
  const updateRate = (cycle: RentCycle, amount: number) => {
      setFormData(prev => ({
          ...prev,
          rates: { ...prev.rates, [cycle]: amount }
      }));
  };

  const handleSave = () => {
    if (formData.name && formData.category) {
      if(editId) DataService.updateService(editId, formData);
      else DataService.addService(formData as any);
      navigate('/myspace/inventory');
    } else {
      alert("Please fill required fields (Name, Category)");
    }
  };

  const RENT_CYCLES: RentCycle[] = ['Hourly', 'Daily', 'Weekly', 'Monthly'];

  return (
    <ConfigLayout 
        title={editId ? 'Edit Listing' : 'Add Listing'} 
        onSave={handleSave} 
        saveLabel={editId ? "Update Listing" : "Add Listing"}
    >
        <div className="space-y-6">
            <SectionHeader title={`${assetType} Details`} />
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Title / Name <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.name || ''} onChange={e => updateField('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder={assetType === 'Professional' ? "e.g. John Doe Photography" : "e.g. Grand Hall"}/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.category || ''} onChange={e => updateField('category', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder={assetType === 'Professional' ? "e.g. Photographer" : "e.g. Venue"}/>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Description</label>
                    <textarea value={formData.description || ''} onChange={e => updateField('description', e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="Describe skills, capacity, etc."/>
                </div>
                {assetType === 'Event Space' && (
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Location</label>
                        <input type="text" value={formData.location || ''} onChange={e => updateField('location', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="e.g. Gulshan 1"/>
                    </div>
                )}
            </div>

            <SectionHeader title="Pricing Rates" />
            <div className="space-y-3">
                 {RENT_CYCLES.map((cycle) => (
                    <div key={cycle} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-3">
                        <span className="text-sm font-medium text-gray-700">{cycle} Rate</span>
                        <div className="flex items-center">
                            <span className="text-gray-400 text-sm font-bold mr-2">৳</span>
                            <input 
                                type="number" 
                                value={formData.rates?.[cycle as RentCycle] || ''} 
                                onChange={e => updateRate(cycle as RentCycle, parseInt(e.target.value) || 0)} 
                                className="w-24 text-right font-medium text-gray-900 outline-none bg-transparent" 
                                placeholder="0"
                            />
                        </div>
                    </div>
                 ))}
            </div>
        </div>
    </ConfigLayout>
  );
};

const BuildingConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const assetType = location.state?.type as AssetType || 'Residential';
    const editId = location.state?.editId;

    const [formData, setFormData] = useState<Partial<Building>>({
        type: assetType,
        city: 'Dhaka',
        area: '',
        name: '',
        address: '',
        floors: 1,
        flat_count: 0,
        amenities: []
    });

    useEffect(() => {
        if(editId) {
            const b = DataService.getBuildingById(editId);
            if(b) setFormData(b);
        }
    }, [editId]);

    const updateField = (field: keyof Building, value: any) => setFormData(prev => ({...prev, [field]: value}));

    const handleSave = () => {
        if(formData.name && formData.area) {
            if(editId) DataService.updateBuilding(editId, formData);
            else DataService.addBuilding(formData as any);
            navigate('/myspace/inventory');
        } else {
            alert("Please fill required fields.");
        }
    };

    return (
        <ConfigLayout title={editId ? 'Edit Property' : 'Add Property'} onSave={handleSave}>
             <div className="space-y-6">
                <SectionHeader title="Property Details" />
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Property Name <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="e.g. Khan Monjil" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">City</label>
                            <select value={formData.city} onChange={e => updateField('city', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10">
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Area <span className="text-red-500">*</span></label>
                            <select value={formData.area} onChange={e => updateField('area', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10">
                                <option value="">Select Area</option>
                                {(AREAS[formData.city] || []).map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Full Address</label>
                        <textarea rows={2} value={formData.address} onChange={e => updateField('address', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="House #, Road #, Block..." />
                    </div>
                </div>

                <SectionHeader title="Structure" />
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Total Floors</label>
                        <input type="number" value={formData.floors} onChange={e => updateField('floors', parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Total Units</label>
                        <input type="number" value={formData.flat_count} onChange={e => updateField('flat_count', parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" />
                    </div>
                </div>
             </div>
        </ConfigLayout>
    );
};

const VehicleConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editId = location.state?.editId;

    const [formData, setFormData] = useState<Partial<Vehicle>>({
        type: 'Car',
        status: 'active',
        name: '',
        license_plate: '',
        rates: { 'Daily': 0, 'Monthly': 0 }
    });

    useEffect(() => {
        if(editId) {
            const v = DataService.getVehicleById(editId);
            if(v) setFormData(v);
        }
    }, [editId]);

    const updateField = (field: keyof Vehicle, value: any) => setFormData(prev => ({...prev, [field]: value}));
    const updateRate = (cycle: RentCycle, amount: number) => setFormData(prev => ({ ...prev, rates: { ...prev.rates, [cycle]: amount } }));

    const handleSave = () => {
        if(formData.name && formData.license_plate) {
            if(editId) DataService.updateVehicle(editId, formData);
            else DataService.addVehicle(formData as any);
            navigate('/myspace/inventory');
        } else {
             alert("Please fill required fields.");
        }
    }

    return (
        <ConfigLayout title={editId ? 'Edit Vehicle' : 'Add Vehicle'} onSave={handleSave}>
             <div className="space-y-6">
                 <SectionHeader title="Vehicle Info" />
                 <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Vehicle Name <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="e.g. Toyota Axio 2018" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">License Plate <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.license_plate} onChange={e => updateField('license_plate', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="e.g. DHA-MET-GA-12..." />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-gray-700 mb-2">Type</label>
                             <select value={formData.type} onChange={e => updateField('type', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10">
                                 {['Car', 'Bike', 'Bus', 'Truck', 'Van'].map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-700 mb-2">Transmission</label>
                             <select value={formData.transmission} onChange={e => updateField('transmission', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10">
                                 <option value="Auto">Auto</option>
                                 <option value="Manual">Manual</option>
                             </select>
                        </div>
                     </div>
                 </div>

                 <SectionHeader title="Rental Rates" />
                 <div className="space-y-3">
                     {['Daily', 'Monthly'].map((cycle) => (
                        <div key={cycle} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-3">
                            <span className="text-sm font-medium text-gray-700">{cycle} Rate</span>
                            <div className="flex items-center">
                                <span className="text-gray-400 text-sm font-bold mr-2">৳</span>
                                <input 
                                    type="number" 
                                    value={formData.rates?.[cycle as RentCycle] || ''} 
                                    onChange={e => updateRate(cycle as RentCycle, parseInt(e.target.value) || 0)} 
                                    className="w-24 text-right font-medium text-gray-900 outline-none bg-transparent" 
                                    placeholder="0"
                                />
                            </div>
                        </div>
                     ))}
                 </div>
             </div>
        </ConfigLayout>
    );
};

const GadgetConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const editId = location.state?.editId;

    const [formData, setFormData] = useState<Partial<Gadget>>({
        category: 'Camera',
        status: 'active',
        name: '',
        rates: { 'Daily': 0, 'Weekly': 0 },
        brand: '',
        model: ''
    });

    useEffect(() => {
        if(editId) {
            const g = DataService.getGadgetById(editId);
            if(g) setFormData(g);
        }
    }, [editId]);

    const updateField = (field: keyof Gadget, value: any) => setFormData(prev => ({...prev, [field]: value}));
    const updateRate = (cycle: RentCycle, amount: number) => setFormData(prev => ({ ...prev, rates: { ...prev.rates, [cycle]: amount } }));

    const handleSave = () => {
        if(formData.name && formData.category) {
            if(editId) DataService.updateGadget(editId, formData);
            else DataService.addGadget(formData as any);
            navigate('/myspace/inventory');
        } else {
             alert("Please fill required fields.");
        }
    }

    return (
        <ConfigLayout title={editId ? 'Edit Equipment' : 'Add Equipment'} onSave={handleSave}>
             <div className="space-y-6">
                 <SectionHeader title="Equipment Details" />
                 <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Item Name <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.name} onChange={e => updateField('name', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="e.g. Sony A7III" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-xs font-bold text-gray-700 mb-2">Category</label>
                             <input type="text" value={formData.category} onChange={e => updateField('category', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="e.g. Camera" />
                        </div>
                        <div>
                             <label className="block text-xs font-bold text-gray-700 mb-2">Brand</label>
                             <input type="text" value={formData.brand} onChange={e => updateField('brand', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="e.g. Sony" />
                        </div>
                     </div>
                 </div>

                 <SectionHeader title="Rental Rates" />
                 <div className="space-y-3">
                     {['Daily', 'Weekly'].map((cycle) => (
                        <div key={cycle} className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-3">
                            <span className="text-sm font-medium text-gray-700">{cycle} Rate</span>
                            <div className="flex items-center">
                                <span className="text-gray-400 text-sm font-bold mr-2">৳</span>
                                <input 
                                    type="number" 
                                    value={formData.rates?.[cycle as RentCycle] || ''} 
                                    onChange={e => updateRate(cycle as RentCycle, parseInt(e.target.value) || 0)} 
                                    className="w-24 text-right font-medium text-gray-900 outline-none bg-transparent" 
                                    placeholder="0"
                                />
                            </div>
                        </div>
                     ))}
                 </div>
             </div>
        </ConfigLayout>
    );
};

const ManageFlats: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const building = DataService.getBuildingById(id!);
    const flats = DataService.getFlats(id!);

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Header 
                title={building?.name || 'Building'} 
                subtitle={`${building?.area}, ${building?.city}`} 
                showBack 
                onBack={() => navigate('/myspace/inventory')}
                action={
                    <button onClick={() => navigate('/myspace/inventory/config-flat', { state: { buildingId: id } })} className="w-8 h-8 bg-[#2d1b4e] text-white rounded-full flex items-center justify-center shadow-md hover:bg-black transition-colors">
                        <Plus size={18} />
                    </button>
                }
            />
            
            <div className="p-5 space-y-3">
                {flats.map(flat => (
                    <div key={flat.id} onClick={() => navigate('/myspace/inventory/config-flat', { state: { editId: flat.id, buildingId: id } })} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-gray-300 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${flat.is_vacant ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {flat.flat_no}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">Floor {flat.floor_no}</h4>
                                <p className="text-xs text-gray-500 mt-0.5">{flat.bedrooms} Bed • {flat.size_sqft} sqft</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-900 text-sm">৳ {flat.monthly_rent.toLocaleString()}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wide mt-1 ${flat.is_vacant ? 'text-green-500' : 'text-gray-400'}`}>
                                {flat.is_vacant ? 'Vacant' : 'Occupied'}
                            </p>
                        </div>
                    </div>
                ))}
                {flats.length === 0 && (
                    <div className="text-center py-10 text-gray-400">
                        <p>No units added yet.</p>
                        <button onClick={() => navigate('/myspace/inventory/config-flat', { state: { buildingId: id } })} className="mt-2 text-[#ff4b9a] font-bold text-sm">Add First Unit</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const FlatConfig: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buildingId = location.state?.buildingId;
    const editId = location.state?.editId;

    const [formData, setFormData] = useState<Partial<Flat>>({
        building_id: buildingId,
        flat_no: '',
        floor_no: 1,
        bedrooms: 3,
        washrooms: 2,
        balconies: 2,
        size_sqft: 1200,
        monthly_rent: 0,
        service_charge: 0,
        rent_type: 'Monthly',
        is_vacant: true,
        // Default util
        gas_bill: 0,
        water_bill: 0
    });

    useEffect(() => {
        if(editId) {
            const f = DataService.getFlatById(editId);
            if(f) setFormData(f);
        }
    }, [editId]);

    const updateField = (field: keyof Flat, value: any) => setFormData(prev => ({...prev, [field]: value}));

    const handleSave = () => {
        if(formData.flat_no && formData.monthly_rent) {
            if(editId) DataService.updateFlat(editId, formData);
            else DataService.addFlat(formData);
            navigate(-1);
        } else {
            alert("Please fill Flat No and Rent.");
        }
    };

    return (
        <ConfigLayout title={editId ? `Edit Unit ${formData.flat_no}` : 'Add New Unit'} onSave={handleSave}>
             <div className="space-y-6">
                 <SectionHeader title="Unit Details" />
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Flat / Unit No <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.flat_no} onChange={e => updateField('flat_no', e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" placeholder="e.g. 4A" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Floor No</label>
                        <input type="number" value={formData.floor_no} onChange={e => updateField('floor_no', parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" />
                     </div>
                 </div>
                 <div className="grid grid-cols-3 gap-3">
                     {[ {l:'Bedrooms', k:'bedrooms'}, {l:'Baths', k:'washrooms'}, {l:'Balcony', k:'balconies'} ].map(i => (
                         <div key={i.k}>
                             <label className="block text-[10px] font-bold text-gray-500 mb-2 uppercase">{i.l}</label>
                             <input type="number" value={formData[i.k as keyof Flat] as number} onChange={e => updateField(i.k as keyof Flat, parseInt(e.target.value))} className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 font-medium text-center focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" />
                         </div>
                     ))}
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Size (Sqft)</label>
                    <input type="number" value={formData.size_sqft} onChange={e => updateField('size_sqft', parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" />
                 </div>
                 
                 <SectionHeader title="Rent & Charges" />
                 <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold text-gray-700 mb-2">Monthly Rent</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                            <input type="number" value={formData.monthly_rent} onChange={e => updateField('monthly_rent', parseInt(e.target.value))} className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Service Charge</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                <input type="number" value={formData.service_charge} onChange={e => updateField('service_charge', parseInt(e.target.value))} className="w-full pl-6 px-3 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" />
                            </div>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2">Gas Bill</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                                <input type="number" value={formData.gas_bill} onChange={e => updateField('gas_bill', parseInt(e.target.value))} className="w-full pl-6 px-3 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm focus:outline-none focus:border-[#ff4b9a] focus:ring-2 focus:ring-[#ff4b9a]/10" />
                            </div>
                         </div>
                     </div>
                 </div>
             </div>
        </ConfigLayout>
    );
};

// --- Inventory Router Component ---
const Inventory: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AssetList />} />
      <Route path="select-type" element={<SelectType />} />
      <Route path="config-service" element={<ServiceConfig />} />
      <Route path="config-building" element={<BuildingConfig />} />
      <Route path="config-vehicle" element={<VehicleConfig />} />
      <Route path="config-gadget" element={<GadgetConfig />} />
      <Route path="manage-flats/:id" element={<ManageFlats />} />
      <Route path="config-flat" element={<FlatConfig />} />
    </Routes>
  );
};

export default Inventory;
