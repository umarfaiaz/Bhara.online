
import { Building, Flat, Tenant, Bill, Vehicle, Gadget, ServiceAsset, AssetType, User } from '../types';

// Mock User
let currentUser: User = {
    id: 'u1',
    name: 'Umar Faiaz Moon',
    email: 'umar@example.com',
    phone: '01712345678',
    role: 'lender',
    plan: 'Pro',
    planCycle: 'Monthly',
    smsBalance: 42,
    joinDate: '2023-01-15',
    subscriptionRenewalDate: '2023-12-15',
    address: 'Uttara, Dhaka',
    avatar: 'https://i.pravatar.cc/150?u=u1'
};

// Initial Data
let buildings: Building[] = [
  {
    id: 'b1',
    user_id: 'u1',
    name: 'Ragib Villa',
    type: 'Residential',
    city: 'Dhaka',
    area: 'Uttara',
    address: 'Sector 4, Road 12, House 45',
    holding_no: '45',
    road_no: '12',
    floors: 6,
    created_at: new Date().toISOString(),
    flat_count: 12,
    occupied_count: 1,
    amenities: ['CCTV', 'Gas', 'Guard'],
    is_listed: true,
    hide_contact: false,
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'],
    listing_description: 'Modern residential building with all amenities in the heart of Uttara.'
  }
];

let vehicles: Vehicle[] = [
  {
    id: 'v1',
    user_id: 'u1',
    name: 'Toyota Corolla 2018',
    license_plate: 'DHA-MET-GA-12-3456',
    type: 'Car',
    transmission: 'Auto',
    fuel_type: 'CNG',
    rates: {
      'Daily': 3000,
      'Monthly': 45000
    },
    status: 'active',
    created_at: new Date().toISOString(),
    is_listed: true,
    images: ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 'v2',
    user_id: 'u1',
    name: 'Yamaha FZ v3',
    license_plate: 'DHA-MET-LA-22-1111',
    type: 'Bike',
    rates: { 'Daily': 1000 },
    status: 'active',
    created_at: new Date().toISOString(),
    is_listed: false, // Unlisted
    images: ['https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800']
  }
];

let gadgets: Gadget[] = [
    {
        id: 'g1',
        user_id: 'u1',
        name: 'Sony A7III Camera',
        brand: 'Sony',
        model: 'A7M3',
        category: 'Camera',
        rates: {
            'Daily': 1500,
            'Weekly': 8000
        },
        default_rent_cycle: 'Daily',
        security_deposit: 5000,
        status: 'active',
        created_at: new Date().toISOString(),
        is_listed: true,
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800']
    }
];

let services: ServiceAsset[] = [
  {
    id: 's1',
    user_id: 'u1',
    name: 'Grand Convention Hall',
    type: 'Event Space',
    category: 'Venue',
    location: 'Gulshan 2',
    description: 'Luxury hall for weddings and corporate events. Capacity 500.',
    rates: {
      'Daily': 50000,
      'Hourly': 5000
    },
    status: 'active',
    created_at: new Date().toISOString(),
    is_listed: true,
    images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800']
  },
  {
    id: 's2',
    user_id: 'u1',
    name: 'Rahim the Photographer',
    type: 'Professional',
    category: 'Photographer',
    description: 'Expert wedding and event photography with 5 years experience.',
    rates: {
      'Daily': 10000,
      'Hourly': 1500
    },
    status: 'active',
    created_at: new Date().toISOString(),
    is_listed: true,
    hide_contact: true,
    images: ['https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=800']
  },
  {
      id: 's3',
      user_id: 'u1',
      name: 'Rockstar Band',
      type: 'Professional',
      category: 'Band',
      description: 'Live music for parties and events.',
      rates: {
          'Hourly': 8000
      },
      status: 'active',
      created_at: new Date().toISOString(),
      is_listed: false // Unlisted
  }
];

let flats: Flat[] = [
  {
    id: 'f1',
    building_id: 'b1',
    floor_no: 4,
    flat_no: '4A',
    size_sqft: 1200,
    bedrooms: 3,
    washrooms: 2,
    balconies: 2,
    has_kitchen: true,
    has_dining: true,
    has_living: true,
    has_gas: true,
    rent_type: 'Monthly',
    monthly_rent: 25000,
    service_charge: 3000,
    water_bill: 500,
    gas_bill: 800,
    electricity_bill: 0, // Postpaid usually
    additional_charges_amount: 0,
    is_vacant: false,
    created_at: new Date().toISOString(),
    tenant_id: 't1',
    is_listed: false
  },
  {
    id: 'f2',
    building_id: 'b1',
    floor_no: 4,
    flat_no: '4B',
    size_sqft: 1250,
    bedrooms: 3,
    washrooms: 2,
    balconies: 2,
    has_kitchen: true,
    has_dining: true,
    has_living: true,
    has_gas: true,
    rent_type: 'Monthly',
    monthly_rent: 26000,
    service_charge: 3000,
    water_bill: 500,
    gas_bill: 800,
    additional_charges_amount: 0,
    is_vacant: true,
    created_at: new Date().toISOString(),
    is_listed: true,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800']
  }
];

let tenants: Tenant[] = [
  {
    id: 't1',
    asset_id: 'f1',
    asset_type: 'Residential',
    full_name: 'Mr. Rafiqul Islam',
    phone: '01711223344',
    profession: 'Banker',
    members_adults: 2,
    members_children: 1,
    start_date: '2023-01-01',
    security_deposit: 50000,
    status: 'active',
    created_at: new Date().toISOString(),
    asset_info: {
        name: 'Flat 4A',
        sub_text: 'Ragib Villa, Uttara'
    }
  },
  {
    id: 't2',
    asset_id: 'v1',
    asset_type: 'Vehicle',
    full_name: 'Uber Driver Karim',
    phone: '01811223344',
    profession: 'Driver',
    start_date: '2023-10-01',
    status: 'active',
    created_at: new Date().toISOString(),
    asset_info: {
        name: 'Toyota Corolla',
        sub_text: 'DHA-MET-GA-12-3456'
    }
  }
];

let bills: Bill[] = [
  {
    id: 'bill_1',
    tenant_id: 't1',
    asset_type: 'Residential',
    month: new Date().toISOString(),
    rent_amount: 25000,
    service_charge: 3000,
    water_bill: 500,
    gas_bill: 800,
    electricity_bill: 1250,
    other_bills: 0,
    additional_charges_amount: 0,
    total: 30550,
    status: 'unpaid',
    created_at: new Date().toISOString(),
    tenant_name: 'Mr. Rafiqul Islam',
    asset_name: 'Flat 4A',
    asset_sub: 'Ragib Villa'
  },
  {
      id: 'bill_2',
      tenant_id: 't2',
      asset_type: 'Vehicle',
      month: new Date().toISOString(),
      rent_amount: 45000, // Monthly rate
      service_charge: 0,
      water_bill: 0,
      gas_bill: 0,
      fuel_cost: 0, // Driver pays fuel
      additional_charges_amount: 0,
      total: 45000,
      status: 'unpaid',
      created_at: new Date().toISOString(),
      tenant_name: 'Uber Driver Karim',
      asset_name: 'Toyota Corolla',
      asset_sub: 'Car Rental'
  }
];

export const UserService = {
    getCurrentUser: () => currentUser,
    updateUser: (data: Partial<User>) => {
        currentUser = { ...currentUser, ...data };
        return currentUser;
    },
    topUpSMS: (amount: number) => {
        currentUser.smsBalance += amount;
        return currentUser;
    },
    updatePlan: (plan: 'Free' | 'Pro' | 'Elite', cycle: 'Monthly' | 'Yearly') => {
        currentUser.plan = plan;
        currentUser.planCycle = cycle;
        const date = new Date();
        if(cycle === 'Monthly') date.setMonth(date.getMonth() + 1);
        else date.setFullYear(date.getFullYear() + 1);
        currentUser.subscriptionRenewalDate = date.toISOString();
        return currentUser;
    }
};

export const DataService = {
  getStats: () => {
    return {
      totalCollected: bills.filter(b => b.status === 'paid' || b.status === 'partial').reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.total : curr.total * 0.4), 0),
      totalPending: bills.filter(b => b.status === 'unpaid' || b.status === 'partial').reduce((acc, curr) => acc + (curr.status === 'unpaid' ? curr.total : curr.total * 0.6), 0),
      occupiedFlats: flats.filter(f => !f.is_vacant).length,
      totalFlats: flats.length,
      rentedVehicles: vehicles.filter(v => v.status === 'rented').length,
      totalVehicles: vehicles.length,
      rentedGadgets: gadgets.filter(g => g.status === 'rented').length,
      totalGadgets: gadgets.length,
      pendingBillsCount: bills.filter(b => b.status === 'unpaid').length
    };
  },

  // Marketplace Listings
  getMarketplaceItems: () => {
      // Aggregate all items where is_listed is true
      const _buildings = buildings.filter(b => b.is_listed).map(b => ({ ...b, category: 'Real Estate', displayPrice: 'Contact for Price' }));
      const _flats = flats.filter(f => f.is_listed).map(f => {
          const b = buildings.find(b => b.id === f.building_id);
          return { ...f, category: 'Real Estate', name: `Flat ${f.flat_no} at ${b?.name}`, location: `${b?.area}, ${b?.city}`, displayPrice: `৳${f.monthly_rent}/mo` };
      });
      const _vehicles = vehicles.filter(v => v.is_listed).map(v => ({ ...v, category: 'Vehicles', displayPrice: `৳${v.rates['Daily'] || v.rates['Monthly']}/day` }));
      const _gadgets = gadgets.filter(g => g.is_listed).map(g => ({ ...g, category: 'Tech', displayPrice: `৳${g.rates['Daily']}/day` }));
      const _services = services.filter(s => s.is_listed).map(s => {
          let cat = 'Services';
          if(s.type === 'Event Space') cat = 'Events';
          return { ...s, category: cat, displayPrice: `৳${Object.values(s.rates)[0] || 0}` };
      });
      return [..._buildings, ..._flats, ..._vehicles, ..._gadgets, ..._services];
  },

  // Generic List Toggler
  toggleListing: (id: string, type: AssetType | 'Flat', isListed: boolean, hideContact: boolean = false) => {
      if (type === 'Residential' || type === 'Commercial' || type === 'Shared') {
          const b = buildings.find(x => x.id === id); if(b) { b.is_listed = isListed; b.hide_contact = hideContact; }
      } else if (type === 'Flat') {
          const f = flats.find(x => x.id === id); if(f) { f.is_listed = isListed; f.hide_contact = hideContact; }
      } else if (type === 'Vehicle') {
          const v = vehicles.find(x => x.id === id); if(v) { v.is_listed = isListed; v.hide_contact = hideContact; }
      } else if (type === 'Gadget') {
          const g = gadgets.find(x => x.id === id); if(g) { g.is_listed = isListed; g.hide_contact = hideContact; }
      } else {
          const s = services.find(x => x.id === id); if(s) { s.is_listed = isListed; s.hide_contact = hideContact; }
      }
  },

  // Buildings
  getBuildings: () => buildings,
  getBuildingById: (id: string) => buildings.find(b => b.id === id),
  addBuilding: (b: Building) => {
      const newB = { ...b, id: `b${Date.now()}`, created_at: new Date().toISOString() };
      buildings.push(newB);
      return newB;
  },
  updateBuilding: (id: string, data: Partial<Building>) => {
      buildings = buildings.map(b => b.id === id ? { ...b, ...data } : b);
  },

  // Flats
  getFlats: (buildingId?: string) => buildingId ? flats.filter(f => f.building_id === buildingId) : flats,
  getFlatById: (id: string) => flats.find(f => f.id === id),
  addFlat: (f: Partial<Flat>) => flats.push({ ...f, id: `f${Date.now()}`, is_vacant: true, created_at: new Date().toISOString() } as Flat),
  updateFlat: (id: string, data: Partial<Flat>) => {
      flats = flats.map(f => f.id === id ? { ...f, ...data } : f);
  },

  // Vehicles
  getVehicles: () => vehicles,
  getVehicleById: (id: string) => vehicles.find(v => v.id === id),
  addVehicle: (v: Vehicle) => vehicles.push({ ...v, id: `v${Date.now()}`, created_at: new Date().toISOString() }),
  updateVehicle: (id: string, data: Partial<Vehicle>) => {
      vehicles = vehicles.map(v => v.id === id ? { ...v, ...data } : v);
  },

  // Gadgets
  getGadgets: () => gadgets,
  getGadgetById: (id: string) => gadgets.find(g => g.id === id),
  addGadget: (g: Gadget) => gadgets.push({ ...g, id: `g${Date.now()}`, created_at: new Date().toISOString() }),
  updateGadget: (id: string, data: Partial<Gadget>) => {
      gadgets = gadgets.map(g => g.id === id ? { ...g, ...data } : g);
  },

  // Services / Professionals
  getServices: () => services,
  getServiceById: (id: string) => services.find(s => s.id === id),
  addService: (s: ServiceAsset) => services.push({ ...s, id: `s${Date.now()}`, created_at: new Date().toISOString() }),
  updateService: (id: string, data: Partial<ServiceAsset>) => {
      services = services.map(s => s.id === id ? { ...s, ...data } : s);
  },

  // Tenants
  getTenants: () => tenants,
  assignTenant: (assetId: string, tenantData: Partial<Tenant>) => {
      const newTenant: Tenant = {
          ...tenantData,
          id: `t${Date.now()}`,
          asset_id: assetId,
          status: 'active',
          created_at: new Date().toISOString()
      } as Tenant;

      let assetName = '';
      let assetSub = '';
      let rentAmount = 0;

      if(tenantData.asset_type === 'Residential') {
          const flat = flats.find(f => f.id === assetId);
          if(flat) {
              flat.is_vacant = false;
              flat.tenant_id = newTenant.id;
              const b = buildings.find(b => b.id === flat.building_id);
              assetName = `Flat ${flat.flat_no}`;
              assetSub = b ? b.name : 'Building';
              rentAmount = flat.monthly_rent;
              newTenant.asset_info = { name: assetName, sub_text: `${b?.name}, ${b?.area}` };
          }
      } else if (tenantData.asset_type === 'Vehicle') {
          const vehicle = vehicles.find(v => v.id === assetId);
          if(vehicle) {
            vehicle.status = 'rented';
            assetName = vehicle.name;
            assetSub = vehicle.license_plate;
            rentAmount = vehicle.rates['Monthly'] || Object.values(vehicle.rates)[0] || 0;
            newTenant.asset_info = { name: assetName, sub_text: assetSub };
          }
      } else if (tenantData.asset_type === 'Gadget') {
          const gadget = gadgets.find(g => g.id === assetId);
          if(gadget) {
              gadget.status = 'rented';
              assetName = gadget.name;
              assetSub = gadget.model || '';
              const cycle = gadget.default_rent_cycle || 'Daily';
              rentAmount = gadget.rates[cycle] || Object.values(gadget.rates)[0] || 0;
              newTenant.asset_info = { name: assetName, sub_text: assetSub };
          }
      } else if (tenantData.asset_type === 'Professional' || tenantData.asset_type === 'Service' || tenantData.asset_type === 'Event Space') {
         const service = services.find(s => s.id === assetId);
         if(service) {
             service.status = 'rented';
             assetName = service.name;
             assetSub = service.category;
             rentAmount = Object.values(service.rates)[0] || 0;
             newTenant.asset_info = { name: assetName, sub_text: assetSub };
         }
      }

      tenants.unshift(newTenant);

      // Generate initial bill
      const newBill: Bill = {
          id: `bill_${Date.now()}`,
          tenant_id: newTenant.id,
          asset_type: tenantData.asset_type!,
          month: new Date().toISOString(),
          rent_amount: rentAmount,
          service_charge: 0,
          water_bill: 0,
          gas_bill: 0,
          electricity_bill: 0,
          additional_charges_amount: 0,
          total: rentAmount,
          status: 'unpaid',
          created_at: new Date().toISOString(),
          tenant_name: newTenant.full_name,
          asset_name: assetName,
          asset_sub: assetSub
      };
      
      // Add Residential specific charges
      if(tenantData.asset_type === 'Residential') {
          const flat = flats.find(f => f.id === assetId);
          if(flat) {
              newBill.service_charge = flat.service_charge;
              newBill.water_bill = flat.water_bill;
              newBill.gas_bill = flat.gas_bill;
              newBill.total = rentAmount + flat.service_charge + flat.water_bill + flat.gas_bill;
          }
      }

      bills.unshift(newBill);
  },
  removeTenant: (tenantId: string, endDate: string) => {
      const t = tenants.find(t => t.id === tenantId);
      if(t) {
          t.status = 'past';
          t.end_date = endDate;
          if(t.asset_type === 'Residential') {
              const f = flats.find(flat => flat.id === t.asset_id);
              if(f) { f.is_vacant = true; f.tenant_id = undefined; }
          } else if (t.asset_type === 'Vehicle') {
              const v = vehicles.find(veh => veh.id === t.asset_id);
              if(v) v.status = 'active';
          } else if (t.asset_type === 'Gadget') {
              const g = gadgets.find(gad => gad.id === t.asset_id);
              if(g) g.status = 'active';
          } else if (['Professional', 'Service', 'Event Space'].includes(t.asset_type)) {
              const s = services.find(serv => serv.id === t.asset_id);
              if(s) s.status = 'active';
          }
      }
  },

  // Bills
  getBills: () => bills,
  updateBill: (id: string, data: Partial<Bill>) => {
      bills = bills.map(b => {
          if (b.id === id) {
              const updated = { ...b, ...data };
              // Recalculate total if charges changed
              if (data.electricity_bill !== undefined || data.additional_charges_amount !== undefined || data.fuel_cost !== undefined || data.toll_cost !== undefined) {
                  const base = updated.rent_amount + updated.service_charge + updated.water_bill + updated.gas_bill;
                  const extras = (updated.electricity_bill || 0) + (updated.other_bills || 0) + (updated.additional_charges_amount || 0);
                  const variable = (updated.fuel_cost || 0) + (updated.driver_allowance || 0) + (updated.toll_cost || 0) + (updated.damage_cost || 0) + (updated.late_fee || 0);
                  updated.total = base + extras + variable;
              }
              return updated;
          }
          return b;
      });
  }
};
