import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, FileText, Package, Truck, DollarSign, ClipboardCheck,
  ShoppingCart, Settings, Bell, Search, ChevronRight, ChevronDown, ChevronUp,
  LogOut, User, Building2, Factory, Ship, Shield, BarChart3,
  TrendingUp, AlertCircle, CheckCircle, Clock, ArrowRight, Eye,
  Boxes, FlaskConical, FileCheck, Anchor, CreditCard, Menu, X,
  Activity, Upload, Download, Filter, RefreshCw, Leaf, Globe, Lock, Mail, ArrowLeft, Star, Edit, Trash2, Plus, Calendar, HelpCircle, Bookmark
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";

// ── Types & Interfaces ──────────────────────────────────────────────────────
type Screen = "email" | "password" | "role" | "dashboard";
type LayoutMode = "list" | "detail" | "add";

interface Order {
  id: string;
  customer: string;
  product: string;
  qty: number; // MT
  packaging: string;
  port: string;
  destination: string;
  deliveryDate: string;
  remarks: string;
  status: "Draft" | "Pending" | "Approved" | "In Production" | "Shipped" | "Delivered";
  date: string;
  contractId?: string;
  planId?: string;
  poId?: string;
  stuffingId?: string;
  inspectionId?: string;
  docSetId?: string;
  bookingId?: string;
}

interface Contract {
  id: string;
  orderId: string;
  customer: string;
  pricing: string;
  terms: string;
  status: "Draft" | "Pending" | "Approved" | "Rejected";
  date: string;
}

interface Plan {
  id: string;
  orderId: string;
  product: string;
  qty: number;
  plant: string;
  priority: "High" | "Medium" | "Low";
  scheduleDate: string;
  status: "Draft" | "Scheduled" | "In Progress" | "Completed";
  vessel: string;
  voyage: string;
}

interface PurchaseOrder {
  id: string;
  orderId: string;
  supplier: string;
  material: string;
  qty: number;
  status: "Draft" | "Ordered" | "Received";
  date: string;
}

interface Inspection {
  id: string;
  orderId: string;
  product: string;
  moisture: string;
  ffa: string; // Free Fatty Acid
  impurities: string;
  status: "Pending" | "Approved" | "Rejected";
  coaGenerated: boolean;
  hcGenerated: boolean;
}

interface ExportDoc {
  id: string;
  orderId: string;
  siStatus: "Pending" | "Draft" | "Submitted";
  plStatus: "Pending" | "Generated";
  ciStatus: "Pending" | "Generated";
  blStatus: "Pending" | "Draft" | "Released";
  customsStatus: "Pending" | "Draft" | "Cleared";
  isComplete: boolean;
}

interface Haulage {
  id: string;
  orderId: string;
  vessel: string;
  voyage: string;
  containerQty: number;
  allocatedQty: number;
  vehicleNo?: string;
  driverName?: string;
  status: "Pending" | "Allocated" | "Dispatched" | "Port Arrived" | "Completed";
}

interface Validation {
  id: string;
  orderId: string;
  value: string;
  status: "Pending" | "Validated";
  collected: boolean;
}

interface SidebarCategory {
  title: string;
  items: { label: string; icon: any; route: string }[];
}

// ── Sidebar Categories Definition ───────────────────────────────────────────
const ROLE_SIDEBAR_CATEGORIES: Record<string, SidebarCategory[]> = {
  customer: [
    {
      title: "Orders & Shipments",
      items: [
        { label: "Orders", icon: ShoppingCart, route: "orders" },
        { label: "Shipment Tracking", icon: Truck, route: "shipments" },
      ]
    },
    {
      title: "Billing & Docs",
      items: [
        { label: "Documents", icon: FileText, route: "documents" },
        { label: "Payments", icon: CreditCard, route: "payments" },
      ]
    }
  ],
  sales: [
    {
      title: "Sales Module",
      items: [
        { label: "Customer Orders", icon: ShoppingCart, route: "orders" },
        { label: "Sales Contracts", icon: FileText, route: "contracts" },
      ]
    },
    {
      title: "Analytics",
      items: [
        { label: "Reports", icon: BarChart3, route: "reports" }
      ]
    }
  ],
  finance: [
    {
      title: "Fulfillment Control",
      items: [
        { label: "Commercial Validation", icon: FileCheck, route: "validations" },
        { label: "Payment Collection", icon: DollarSign, route: "collections" },
      ]
    },
    {
      title: "Settlements",
      items: [
        { label: "Settlement", icon: CheckCircle, route: "settlement" }
      ]
    }
  ],
  planning: [
    {
      title: "Refinery Scheduling",
      items: [
        { label: "Material Availability", icon: Boxes, route: "materials" },
        { label: "Production Planning", icon: BarChart3, route: "planning" },
      ]
    },
    {
      title: "Logistics",
      items: [
        { label: "Vessel Schedule", icon: Ship, route: "vessels" }
      ]
    }
  ],
  procurement: [
    {
      title: "Supply Chain",
      items: [
        { label: "Purchase Orders", icon: FileText, route: "pos" },
        { label: "Suppliers", icon: Building2, route: "suppliers" },
      ]
    },
    {
      title: "Inventory",
      items: [
        { label: "Material Receiving", icon: Download, route: "receiving" }
      ]
    }
  ],
  production: [
    {
      title: "Operations",
      items: [
        { label: "Production Orders", icon: Factory, route: "prodorders" },
        { label: "Container Stuffing", icon: Boxes, route: "stuffing" },
      ]
    },
    {
      title: "Logistics Output",
      items: [
        { label: "Dispatch Confirmation", icon: Truck, route: "dispatch" }
      ]
    }
  ],
  qa: [
    {
      title: "Quality Assurance",
      items: [
        { label: "Material Inspection", icon: FlaskConical, route: "inspections" },
        { label: "QA Approval", icon: CheckCircle, route: "qaapprovals" }
      ]
    }
  ],
  export: [
    {
      title: "Compliance & Docs",
      items: [
        { label: "Shipping Instructions", icon: FileText, route: "si" },
        { label: "Export Tracker", icon: ClipboardCheck, route: "tracker" }
      ]
    }
  ],
  logistics: [
    {
      title: "Transport Booking",
      items: [
        { label: "Vessel Bookings", icon: Ship, route: "bookings" },
        { label: "Container Allocation", icon: Package, route: "allocation" },
      ]
    },
    {
      title: "Port Delivery",
      items: [
        { label: "Port Delivery", icon: Anchor, route: "delivery" }
      ]
    }
  ]
};

// ── Roles Specification ─────────────────────────────────────────────────────
const ROLES = [
  {
    id: "customer",
    label: "Customer",
    icon: User,
    color: "#0ea5e9",
    bg: "#f0f9ff",
    desc: "Monitor shipment, download export documents and track payment status.",
  },
  {
    id: "sales",
    label: "Sales Team",
    icon: TrendingUp,
    color: "#2563eb",
    bg: "#eff6ff",
    desc: "Manage customer orders, contracts, pricing and approvals.",
  },
  {
    id: "finance",
    label: "Finance Team",
    icon: DollarSign,
    color: "#0f766e",
    bg: "#f0fdfa",
    desc: "Commercial validation, payment collection and receivables settlement.",
  },
  {
    id: "planning",
    label: "Production Planning Team",
    icon: BarChart3,
    color: "#0891b2",
    bg: "#ecfeff",
    desc: "Plan production capacity, vessel schedules and container regulations.",
  },
  {
    id: "procurement",
    label: "Procurement Team",
    icon: ShoppingCart,
    color: "#059669",
    bg: "#f0fdf4",
    desc: "Manage purchase orders, suppliers and material receiving.",
  },
  {
    id: "production",
    label: "Production Team",
    icon: Factory,
    color: "#7c3aed",
    bg: "#faf5ff",
    desc: "Production orders, batch processing, packaging and container stuffing.",
  },
  {
    id: "export",
    label: "Export Documentation Team",
    icon: FileCheck,
    color: "#0284c7",
    bg: "#f0f9ff",
    desc: "Shipping instructions, packing lists, BL drafts and customs declarations.",
  },
  {
    id: "qa",
    label: "Quality Team",
    icon: FlaskConical,
    color: "#dc2626",
    bg: "#fef2f2",
    desc: "Material inspection, QA approval, and certificate generation.",
  },
  {
    id: "logistics",
    label: "Haulage Team",
    icon: Truck,
    color: "#16a34a",
    bg: "#f0fdf4",
    desc: "Vessel booking, container allocation and port delivery.",
  },
];

// ── Initial Mock Data ────────────────────────────────────────────────────────
const INITIAL_ORDERS: Order[] = [
  {
    id: "SO-2026-001",
    customer: "Sarafiah Trading Sdn Bhd",
    product: "Crude Palm Oil (CPO)",
    qty: 1200,
    packaging: "Flexibags",
    port: "Port Klang",
    destination: "Rotterdam, Netherlands",
    deliveryDate: "2026-07-28",
    remarks: "Premium grade low moisture CPO.",
    status: "Approved",
    date: "2026-07-01",
    contractId: "CT-2026-001",
  },
  {
    id: "SO-2026-002",
    customer: "Global Edible Oils Ltd",
    product: "RBD Palm Olein",
    qty: 500,
    packaging: "20L Jerrycans",
    port: "Pasir Gudang",
    destination: "Mumbai, India",
    deliveryDate: "2026-08-05",
    remarks: "Requires special shipping markings.",
    status: "Pending",
    date: "2026-07-02",
  },
];

const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "CT-2026-001",
    orderId: "SO-2026-001",
    customer: "Sarafiah Trading Sdn Bhd",
    pricing: "MYR 4,200 / MT",
    terms: "FOB Port Klang, Letter of Credit 30 days",
    status: "Approved",
    date: "2026-07-02",
  },
];

const INITIAL_PLANS: Plan[] = [
  {
    id: "PL-2026-001",
    orderId: "SO-2026-001",
    product: "Crude Palm Oil (CPO)",
    qty: 1200,
    plant: "Sarawak Refinery Plant A",
    priority: "High",
    scheduleDate: "2026-07-15",
    status: "Scheduled",
    vessel: "MV Pacific Star",
    voyage: "PS-2026-07",
  },
];

const INITIAL_POS: PurchaseOrder[] = [
  {
    id: "PO-2026-001",
    orderId: "SO-2026-001",
    supplier: "Sarawak Plantation Group",
    material: "FFB (Fresh Fruit Bunches)",
    qty: 6000,
    status: "Received",
    date: "2026-07-03",
  },
];

const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: "QC-2026-001",
    orderId: "SO-2026-001",
    product: "Crude Palm Oil (CPO)",
    moisture: "0.12%",
    ffa: "2.8%",
    impurities: "0.01%",
    status: "Approved",
    coaGenerated: true,
    hcGenerated: true,
  },
];

const INITIAL_DOCS: ExportDoc[] = [
  {
    id: "DOC-2026-001",
    orderId: "SO-2026-001",
    siStatus: "Submitted",
    plStatus: "Generated",
    ciStatus: "Generated",
    blStatus: "Released",
    customsStatus: "Cleared",
    isComplete: true,
  },
];

const INITIAL_HAULAGES: Haulage[] = [
  {
    id: "HL-2026-001",
    orderId: "SO-2026-001",
    vessel: "MV Pacific Star",
    voyage: "PS-2026-07",
    containerQty: 60,
    allocatedQty: 60,
    vehicleNo: "QAA 8872 B",
    driverName: "Ahmad Rizal",
    status: "Completed",
  },
];

const INITIAL_VALIDATIONS: Validation[] = [
  {
    id: "FV-2026-001",
    orderId: "SO-2026-001",
    value: "MYR 5,040,000",
    status: "Validated",
    collected: true,
  },
];

// ── Redesigned KPI Card (Matching new screenshot) ───────────────────────────
function NewKPICard({ label, value, sub, icon: Icon, color, trend = "↗ 12%" }: {
  label: string; value: string | number; sub: string; icon: any; color: string; trend?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow text-[#030213]">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-extrabold text-slate-800">{value}</span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
            {trend}
          </span>
        </div>
        <p className="text-xs font-bold text-slate-700">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-indigo-600" style={{ background: color + "12" }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
  );
}

// Auth Layout wrapper
function AuthSplit({ children, quote, quoteAuthor }: { children: React.ReactNode; quote: string; quoteAuthor: string }) {
  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="hidden lg:flex lg:w-[55%] relative flex-col overflow-hidden bg-[#0f172a]">
        <img
          src="https://images.unsplash.com/photo-1432298026442-0eabd0a98870?w=1400&h=1800&fit=crop&auto=format"
          alt="Palm oil plantation"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
        />
        <div className="relative z-10 flex flex-col h-full p-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center">
              <Leaf size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-base leading-none tracking-wide">ROCKEYE ERP</p>
              <p className="text-white/60 text-xs mt-0.5">Sarawak Export Division</p>
            </div>
          </div>
          <div className="flex-1" />
          <div className="max-w-md">
            <div className="w-8 h-1 bg-emerald-400 rounded mb-6" />
            <p className="text-white text-xl font-medium leading-relaxed">{quote}</p>
            <p className="text-white/50 text-sm mt-4">{quoteAuthor}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center bg-slate-50/70 px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-200/40 space-y-6">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Sarawak Division</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<typeof ROLES[0]>(ROLES[1]); // Default Sales Team
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("list");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Collapse state for sidebar categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  // Unified State (Mock Database)
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(INITIAL_POS);
  const [inspections, setInspections] = useState<Inspection[]>(INITIAL_INSPECTIONS);
  const [docs, setDocs] = useState<ExportDoc[]>(INITIAL_DOCS);
  const [haulages, setHaulages] = useState<Haulage[]>(INITIAL_HAULAGES);
  const [validations, setValidations] = useState<Validation[]>(INITIAL_VALIDATIONS);

  // Active detail view ID
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Forms Input States
  const [formCust, setFormCust] = useState("Sarafiah Trading Sdn Bhd");
  const [formProd, setFormProd] = useState("Crude Palm Oil (CPO)");
  const [formQty, setFormQty] = useState(1200);
  const [formPack, setFormPack] = useState("Flexibags");
  const [formPort, setFormPort] = useState("Port Klang");
  const [formDest, setFormDest] = useState("Rotterdam, Netherlands");
  const [formDate, setFormDate] = useState("2026-07-30");
  const [formPlant, setFormPlant] = useState("Sarawak Refinery Plant A");
  const [formBOM, setFormBOM] = useState("Acid Activated Bleaching Clay");
  const [formCostUnit, setFormCostUnit] = useState(2.49);
  const [formRefNo, setFormRefNo] = useState("REF-2026-001");
  const [formRemarks, setFormRemarks] = useState("");
  const pendingOrdersCount = useMemo(() => orders.filter(o => o.status === "Pending").length, [orders]);
  const pendingContractsCount = useMemo(() => contracts.filter(c => c.status === "Pending").length, [contracts]);

  const categories = ROLE_SIDEBAR_CATEGORIES[selectedRole.id] ?? [];

  // Toggle category collapse
  const toggleCategory = (title: string) => {
    setCollapsedCategories(prev => ({ ...prev, [title]: !prev[title] }));
  };

  // ── Screen checks for login and role selection ──
  if (screen === "email" || screen === "password") {
    return (
      <AuthSplit
        quote="Connecting every step of the palm oil lifecycle — from contract to collection, plantation to port."
        quoteAuthor="ROCKEYE Palm Oil - Sarawak Export Division"
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-xs text-slate-400 font-semibold">Sign in to your Sarawak Export Division account</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setScreen("role"); }} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Corporate Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@rockeye.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium text-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium text-slate-800"
              />
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] py-0.5">
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-500 hover:text-slate-800 select-none">
              <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5" /> Remember me
            </label>
            <a href="#" className="text-blue-600 font-bold hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-200 hover:shadow-lg transition-all flex items-center justify-center gap-1.5">
            Sign In <ArrowRight size={14} />
          </button>
        </form>

        {/* Dummy Credentials Helper Box */}
        <div 
          onClick={() => { setEmail("admin@rockeye.com"); setPassword("admin123"); }}
          className="mt-6 p-4 bg-slate-50 border border-slate-100 hover:bg-blue-50/70 hover:border-blue-200 cursor-pointer rounded-2xl space-y-2 text-xs transition-all select-none group"
        >
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-700 group-hover:text-blue-700 flex items-center gap-1.5 transition-colors">
              <Shield size={14} className="text-slate-400 group-hover:text-blue-500" /> System Credentials
            </p>
            <span className="text-[9px] text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full font-bold group-hover:bg-blue-100/50 transition-colors">Click to autofill</span>
          </div>
          <div className="text-slate-500 font-medium space-y-1 mt-1 text-[11px]">
            <p className="flex justify-between">
              <span>Email:</span> 
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200/60 text-slate-700 font-mono text-[10px] font-bold">admin@rockeye.com</code>
            </p>
            <p className="flex justify-between">
              <span>Password:</span> 
              <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200/60 text-slate-700 font-mono text-[10px] font-bold">admin123</code>
            </p>
          </div>
        </div>
      </AuthSplit>
    );
  }


  if (screen === "role") {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between py-12 px-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <div className="max-w-5xl mx-auto w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mx-auto shadow-md">
              <Leaf size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Select Your Role</h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Choose the role that reflects your responsibilities. The system loads only the modules and dashboards assigned to that role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ROLES.map((role) => {
              const RoleIcon = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => { setSelectedRole(role); setScreen("dashboard"); }}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex flex-col justify-between h-44"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:scale-105 duration-200" style={{ backgroundColor: role.bg, color: role.color }}>
                      <RoleIcon size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{role.label}</h3>
                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1.5">{role.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity self-end mt-2">
                    Access Dashboard <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 font-semibold tracking-wide mt-12">
          Copyright 2026 © ROCKEYE. All Rights Reserved.
        </div>
      </div>
    );
  }

  // ── Helper functions for workflows ──
  const triggerApproveContract = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: "Approved" } : o));
    setContracts(contracts.map(c => c.orderId === orderId ? { ...c, status: "Approved" } : c));
  };

  const triggerCreateContract = (orderId: string) => {
    const o = orders.find(ord => ord.id === orderId);
    if (!o) return;
    const newContract: Contract = {
      id: `CT-2026-00${contracts.length + 1}`,
      orderId: orderId,
      customer: o.customer,
      pricing: "MYR 4,150 / MT",
      terms: "LC at sight, FOB Sarawak Port",
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };
    setContracts([...contracts, newContract]);
    setOrders(orders.map(ord => ord.id === orderId ? { ...ord, contractId: newContract.id } : ord));
  };

  const triggerCreateProductionPlan = (orderId: string) => {
    const o = orders.find(ord => ord.id === orderId);
    if (!o) return;
    const newPlan: Plan = {
      id: `PL-2026-00${plans.length + 1}`,
      orderId: orderId,
      product: o.product,
      qty: o.qty,
      plant: "Sarawak Refinery Plant B",
      priority: "Medium",
      scheduleDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "Scheduled",
      vessel: "MV Sarawak Pearl",
      voyage: "SP-2026-08",
    };
    setPlans([...plans, newPlan]);
    setOrders(orders.map(ord => ord.id === orderId ? { ...ord, status: "In Production", planId: newPlan.id } : ord));

    const newPO: PurchaseOrder = {
      id: `PO-2026-00${purchaseOrders.length + 1}`,
      orderId: orderId,
      supplier: "Borneo Agri-Seeds Corp",
      material: "Crude Palm Oil (Raw)",
      qty: o.qty * 1.1,
      status: "Ordered",
      date: new Date().toISOString().split("T")[0],
    };
    setPurchaseOrders([...purchaseOrders, newPO]);
  };

  const triggerConfirmReceipt = (orderId: string) => {
    setPurchaseOrders(purchaseOrders.map(po => po.orderId === orderId ? { ...po, status: "Received" } : po));
  };

  const triggerExecuteProduction = (orderId: string) => {
    setPlans(plans.map(p => p.orderId === orderId ? { ...p, status: "Completed" } : p));
  };

  const triggerStuffContainer = (orderId: string) => {
    const o = orders.find(ord => ord.id === orderId);
    if (!o) return;
    const newHaulage: Haulage = {
      id: `HL-2026-00${haulages.length + 1}`,
      orderId: orderId,
      vessel: "MV Sarawak Pearl",
      voyage: "SP-2026-08",
      containerQty: Math.ceil(o.qty / 20),
      allocatedQty: Math.ceil(o.qty / 20),
      vehicleNo: "QAA 9982 C",
      driverName: "Mohd Shukri",
      status: "Allocated",
    };
    setHaulages([...haulages, newHaulage]);
  };

  const triggerDispatchHaulage = (orderId: string) => {
    setHaulages(haulages.map(h => h.orderId === orderId ? { ...h, status: "Dispatched" } : h));
  };

  const triggerPortArrival = (orderId: string) => {
    setHaulages(haulages.map(h => h.orderId === orderId ? { ...h, status: "Port Arrived" } : h));
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: "Shipped" } : o));
  };

  const triggerQAInspection = (orderId: string) => {
    const o = orders.find(ord => ord.id === orderId);
    if (!o) return;
    const newQA: Inspection = {
      id: `QC-2026-00${inspections.length + 1}`,
      orderId: orderId,
      product: o.product,
      moisture: "0.10%",
      ffa: "2.5%",
      impurities: "0.005%",
      status: "Approved",
      coaGenerated: true,
      hcGenerated: true,
    };
    setInspections([...inspections, newQA]);
  };

  const triggerGenerateExportDocs = (orderId: string) => {
    const newDoc: ExportDoc = {
      id: `DOC-2026-00${docs.length + 1}`,
      orderId: orderId,
      siStatus: "Submitted",
      plStatus: "Generated",
      ciStatus: "Generated",
      blStatus: "Released",
      customsStatus: "Cleared",
      isComplete: true,
    };
    setDocs([...docs, newDoc]);

    const o = orders.find(ord => ord.id === orderId);
    const newVal: Validation = {
      id: `FV-2026-00${validations.length + 1}`,
      orderId: orderId,
      value: `MYR ${(o?.qty ?? 1000) * 4200}`,
      status: "Validated",
      collected: false,
    };
    setValidations([...validations, newVal]);
  };

  const triggerCollectPayment = (orderId: string) => {
    setValidations(validations.map(v => v.orderId === orderId ? { ...v, collected: true } : v));
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: "Delivered" } : o));
  };

  // Submit order form
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: `SO-2026-00${orders.length + 1}`,
      customer: formCust,
      product: formProd,
      qty: Number(formQty),
      packaging: formPack,
      port: formPort,
      destination: formDest,
      deliveryDate: formDate,
      remarks: formRemarks,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };
    setOrders([...orders, newOrder]);
    setLayoutMode("list");
  };

  const getLinkedContract = (orderId: string) => contracts.find(c => c.orderId === orderId);
  const getLinkedPlan = (orderId: string) => plans.find(p => p.orderId === orderId);
  const getLinkedPO = (orderId: string) => purchaseOrders.find(po => po.orderId === orderId);
  const getLinkedInspection = (orderId: string) => inspections.find(i => i.orderId === orderId);
  const getLinkedDoc = (orderId: string) => docs.find(d => d.orderId === orderId);
  const getLinkedHaulage = (orderId: string) => haulages.find(h => h.orderId === orderId);
  const getLinkedValidation = (orderId: string) => validations.find(v => v.orderId === orderId);

  const getStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Pending: "bg-amber-50 text-amber-700 border-amber-200",
      Draft: "bg-slate-50 text-slate-600 border-slate-200",
      "In Production": "bg-purple-50 text-purple-700 border-purple-200",
      Shipped: "bg-sky-50 text-sky-700 border-sky-200",
      Delivered: "bg-teal-50 text-teal-700 border-teal-200",
      Received: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Ordered: "bg-blue-50 text-blue-700 border-blue-200",
      Scheduled: "bg-cyan-50 text-cyan-700 border-cyan-200",
      Completed: "bg-teal-50 text-teal-700 border-teal-200",
      Allocated: "bg-indigo-50 text-indigo-700 border-indigo-200",
      Dispatched: "bg-violet-50 text-violet-700 border-violet-200",
      "Port Arrived": "bg-sky-50 text-sky-700 border-sky-200",
      Validated: "bg-teal-50 text-teal-700 border-teal-200",
    };
    const cls = map[status] ?? "bg-slate-50 text-slate-600 border-slate-200";
    return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${cls}`}>{status}</span>;
  };

  // ── RENDER COMPONENT: Full-Page Details Screen (matching screenshot) ──
  const renderDetailsScreen = () => {
    const o = orders.find(ord => ord.id === selectedItemId);
    if (!o) return null;

    const contract = getLinkedContract(o.id);
    const plan = getLinkedPlan(o.id);
    const po = getLinkedPO(o.id);
    const inspection = getLinkedInspection(o.id);
    const doc = getLinkedDoc(o.id);
    const haulage = getLinkedHaulage(o.id);
    const validation = getLinkedValidation(o.id);

    let nextActionLabel = null;
    let nextActionCallback = () => {};

    if (selectedRole.id === "sales" && o.status === "Pending" && !contract) {
      nextActionLabel = "Draft Sales Contract";
      nextActionCallback = () => triggerCreateContract(o.id);
    } else if (selectedRole.id === "sales" && contract && contract.status === "Pending") {
      nextActionLabel = "Approve Contract";
      nextActionCallback = () => triggerApproveContract(o.id);
    } else if (selectedRole.id === "planning" && o.status === "Approved" && !plan) {
      nextActionLabel = "Schedule Plan";
      nextActionCallback = () => triggerCreateProductionPlan(o.id);
    } else if (selectedRole.id === "procurement" && po && po.status === "Ordered") {
      nextActionLabel = "Confirm Raw Material Receipt";
      nextActionCallback = () => triggerConfirmReceipt(o.id);
    } else if (selectedRole.id === "production" && plan && plan.status === "Scheduled") {
      nextActionLabel = "Create Batch";
      nextActionCallback = () => triggerExecuteProduction(o.id);
    } else if (selectedRole.id === "production" && plan && plan.status === "Completed" && !haulage) {
      nextActionLabel = "Stuff Containers";
      nextActionCallback = () => triggerStuffContainer(o.id);
    } else if (selectedRole.id === "qa" && plan && plan.status === "Completed" && !inspection) {
      nextActionLabel = "Certify Quality";
      nextActionCallback = () => triggerQAInspection(o.id);
    } else if (selectedRole.id === "export" && inspection && inspection.status === "Approved" && !doc) {
      nextActionLabel = "Generate Docs";
      nextActionCallback = () => triggerGenerateExportDocs(o.id);
    } else if (selectedRole.id === "logistics" && haulage && haulage.status === "Allocated") {
      nextActionLabel = "Dispatch Haulage";
      nextActionCallback = () => triggerDispatchHaulage(o.id);
    } else if (selectedRole.id === "logistics" && haulage && haulage.status === "Dispatched") {
      nextActionLabel = "Confirm Port Arrival";
      nextActionCallback = () => triggerPortArrival(o.id);
    } else if (selectedRole.id === "finance" && validation && !validation.collected) {
      nextActionLabel = "Collect Payment";
      nextActionCallback = () => triggerCollectPayment(o.id);
    }

    return (
      <div className="space-y-6 text-[#030213]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Breadcrumb & Title Bar */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              <span>{selectedRole.label}</span>
              <ChevronRight size={10} />
              <span className="text-slate-600 hover:underline cursor-pointer" onClick={() => setLayoutMode("list")}>{activeTab}</span>
              <ChevronRight size={10} />
              <span className="text-slate-600">Details</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Details</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-lg transition">Edit</button>
            {nextActionLabel && (
              <button onClick={() => { nextActionCallback(); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition">
                {nextActionLabel}
              </button>
            )}
          </div>
        </div>

        {/* Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Sidebar Card */}
          <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-800">{o.id}</h3>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase mt-1 inline-block">{o.status}</span>
              </div>
              <button className="text-slate-400 hover:text-slate-600"><Menu size={16} /></button>
            </div>
            <div className="space-y-1">
              <button className="w-full flex items-center gap-2.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold text-left">
                <FileText size={14} /> Summary
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold text-left">
                <Factory size={14} /> Batch Details
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold text-left">
                <DollarSign size={14} /> Finance Vouchers
              </button>
            </div>
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5"><FileText size={14} /> Notes</span>
                <span className="bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">0</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5"><Activity size={14} /> Activities</span>
                <span className="bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">0</span>
              </div>
            </div>
          </div>

          {/* Main Cards */}
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-100 p-5 md:col-span-2 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-50">
                    <img src="https://images.unsplash.com/photo-1604506522146-316c8bedd874?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono font-bold text-blue-600">{o.id}</h3>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{o.product}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold block">Customer Name</span>
                    <span className="text-blue-600 font-bold hover:underline cursor-pointer mt-0.5 block">{o.customer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Plant Name</span>
                    <span className="text-blue-600 font-bold hover:underline cursor-pointer mt-0.5 block">{plan?.plant || "Sarawak Refinery Plant A"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Bill Of Material</span>
                    <span className="text-blue-600 font-bold hover:underline cursor-pointer mt-0.5 block">{o.product} Packing</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Process Template</span>
                    <span className="text-blue-600 font-bold hover:underline cursor-pointer mt-0.5 block">Export Packing Process</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Plant Location</span>
                    <span className="text-slate-600 mt-0.5 block">Sarawak</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Production Date</span>
                    <span className="text-slate-600 font-medium mt-0.5 block">{o.deliveryDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Source</span>
                    <span className="text-slate-600 mt-0.5 block">Web</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block">Status</span>
                    <span className="text-amber-600 font-bold mt-0.5 block">{o.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-3.5">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">Cost & Time Details</h4>
                  <div className="text-xs space-y-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Item Cost Per Unit</span>
                      <span className="font-bold text-slate-700">$ 2.49</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Estimated Total Cost</span>
                      <span className="font-extrabold text-slate-800">$ {(o.qty * 2.49).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Actual Cost</span>
                      <span className="text-slate-500">—</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-semibold">Total Turnaround Time</span>
                      <span className="font-semibold text-slate-600">48 Hours</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Added Info</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-900">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Demo PalmOil</p>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{o.date} 05:01 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity details */}
            <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Quantity Details</h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2 text-left">Qty</th>
                    <th className="py-2 text-left">Item UOM (Kilogram)</th>
                    <th className="py-2 text-left">Package UOM (MTON)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <tr>
                    <td className="py-2 font-semibold text-slate-500">Requested Qty</td>
                    <td className="py-2 text-slate-700">{(o.qty * 1000).toLocaleString()}.00</td>
                    <td className="py-2 text-slate-700">{Math.ceil(o.qty / 20)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-slate-500">Pending Qty</td>
                    <td className="py-2 text-slate-700">{o.status === "Pending" ? (o.qty * 1000).toLocaleString() + ".00" : "0.00"}</td>
                    <td className="py-2 text-slate-700">{o.status === "Pending" ? Math.ceil(o.qty / 20) : "0"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-slate-500">In Progress Qty</td>
                    <td className="py-2 text-slate-700">{o.status === "In Production" ? (o.qty * 1000).toLocaleString() + ".00" : "0.00"}</td>
                    <td className="py-2 text-slate-700">{o.status === "In Production" ? Math.ceil(o.qty / 20) : "0"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-semibold text-slate-500">Completed Qty</td>
                    <td className="py-2 text-slate-700">{o.status === "Delivered" ? (o.qty * 1000).toLocaleString() + ".00" : "0.00"}</td>
                    <td className="py-2 text-slate-700">{o.status === "Delivered" ? Math.ceil(o.qty / 20) : "0"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Card: Item Details */}
            <div className="bg-white rounded-xl border border-slate-100 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Item Details</h4>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1">
                    <span>Package Quantity</span>
                    <button className="w-8 h-4 bg-blue-600 rounded-full p-0.5 relative transition-colors">
                      <span className="w-3 h-3 bg-white rounded-full block ml-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                    <span className="text-blue-600 pb-1 border-b-2 border-blue-600 cursor-pointer">Raw Material</span>
                    <span className="cursor-pointer hover:text-slate-800">Semi Finished Products</span>
                    <span className="cursor-pointer hover:text-slate-800">Finished Products</span>
                  </div>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-2 text-left">Sr. No.</th>
                    <th className="py-2 text-left">Item Image</th>
                    <th className="py-2 text-left">Item Name</th>
                    <th className="py-2 text-left">Qty Per Unit</th>
                    <th className="py-2 text-left">Cost Per Unit</th>
                    <th className="py-2 text-left">Total Required Qty</th>
                    <th className="py-2 text-left">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-50">
                    <td className="py-3 text-slate-500 font-semibold">1</td>
                    <td className="py-3">
                      <div className="w-8 h-8 bg-slate-50 rounded border overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=50&h=50&fit=crop" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 text-blue-600 font-bold hover:underline cursor-pointer">Jumbo Bag (JUMBOBAG001 / JB)</td>
                    <td className="py-3 text-slate-700">1.00 PCS</td>
                    <td className="py-3 text-slate-700">$ 0.26</td>
                    <td className="py-3 text-slate-700">{Math.ceil(o.qty / 5).toLocaleString()}.00 PCS</td>
                    <td className="py-3 text-slate-800 font-bold">$ {(Math.ceil(o.qty / 5) * 0.26).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-semibold">2</td>
                    <td className="py-3">
                      <div className="w-8 h-8 bg-slate-50 rounded border overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1604506522146-316c8bedd874?w=50&h=50&fit=crop" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 text-blue-600 font-bold hover:underline cursor-pointer">Raw Clay Material (RAWCLAY002)</td>
                    <td className="py-3 text-slate-700">1.00 MT</td>
                    <td className="py-3 text-slate-700">$ 2.10</td>
                    <td className="py-3 text-slate-700">{o.qty.toLocaleString()}.00 MT</td>
                    <td className="py-3 text-slate-800 font-bold">$ {(o.qty * 2.10).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Back Button */}
            <div className="flex justify-end pt-2">
              <button onClick={() => setLayoutMode("list")} className="px-5 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                Back to Listing
              </button>
            </div>
          </div>
        </div>

        {/* Brand Copyright */}
        <div className="text-center py-4 border-t border-slate-100 text-[10px] text-slate-400 font-semibold tracking-wide">
          Copyright 2026 © ROCKEYE. All Rights Reserved.
        </div>
      </div>
    );
  };

  // ── RENDER COMPONENT: Full-Page Add New Form (matching screenshot) ──
  const renderAddFormScreen = () => {
    return (
      <div className="space-y-6 text-[#030213]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Breadcrumb & Title Bar */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              <span>{selectedRole.label}</span>
              <ChevronRight size={10} />
              <span className="text-slate-600 hover:underline cursor-pointer" onClick={() => setLayoutMode("list")}>{activeTab}</span>
              <ChevronRight size={10} />
              <span className="text-slate-600">Add New</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Add New</h1>
          </div>
        </div>

        {/* Large White Form Container */}
        <div className="bg-white rounded-xl border border-slate-100 p-6 space-y-6">
          <form onSubmit={handleCreateOrder} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold text-slate-600">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 mb-1.5">Customer Name*</label>
                  <select value={formCust} onChange={e => setFormCust(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                    <option>Sarafiah Trading Sdn Bhd</option>
                    <option>Global Edible Oils Ltd</option>
                    <option>Nippon Lipids Corp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Production Item*</label>
                  <input type="text" value={formProd} onChange={e => setFormProd(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Enter Production Item" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Manufacture Type*</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                    <option>Refined Palm Oil Packing</option>
                    <option>Crude Refining & Bulk</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Package Qty*</label>
                  <input type="number" value={Math.ceil(formQty / 20)} onChange={e => { const q = Number(e.target.value) * 20; setFormQty(q); }} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Estimated Total Cost</label>
                  <input type="text" readOnly value={`$ ${(formQty * formCostUnit).toFixed(2)}`} className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg outline-none font-bold text-slate-700" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Production Date*</label>
                  <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-700 mb-1.5">Plant*</label>
                  <select value={formPlant} onChange={e => setFormPlant(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium">
                    <option>Sarawak Refinery Plant A</option>
                    <option>Sarawak Refinery Plant B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Bill Of Material*</label>
                  <input type="text" value={formBOM} onChange={e => setFormBOM(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Enter Bill Of Material" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Production Qty*</label>
                  <input type="number" value={formQty} onChange={e => setFormQty(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Enter Production Qty" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Item Cost Per Unit*</label>
                  <input type="number" step="0.01" value={formCostUnit} onChange={e => setFormCostUnit(Number(e.target.value))} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Reference Number</label>
                  <input type="text" value={formRefNo} onChange={e => setFormRefNo(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Enter Reference Number" />
                </div>
                <div>
                  <label className="block text-slate-700 mb-1.5">Remarks</label>
                  <textarea value={formRemarks} onChange={e => setFormRemarks(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium" placeholder="Enter Remarks" rows={3} />
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Attachments</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition">
                <Upload size={24} className="mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium">Drop files here or click to upload</p>
              </div>
            </div>

            {/* Material Details Table */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Material Details</h4>
                <div className="flex gap-2 text-xs font-semibold text-slate-400">
                  <span className="text-blue-600 pb-0.5 border-b border-blue-600 cursor-pointer">Raw Material(s)</span>
                  <span className="cursor-pointer">Semi Finished Products</span>
                  <span className="cursor-pointer">Finished Products</span>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 font-bold uppercase tracking-wider text-left border-b border-slate-100">
                    <th className="py-2">Sr. No.</th>
                    <th className="py-2">Item Name*</th>
                    <th className="py-2">Qty Per Unit*</th>
                    <th className="py-2">Cost Per Unit*</th>
                    <th className="py-2">Total Required Qty</th>
                    <th className="py-2">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-50">
                    <td className="py-3 text-slate-500 font-semibold">1</td>
                    <td className="py-3 text-slate-700">Jumbo Bag</td>
                    <td className="py-3 text-slate-700">1.00 PCS</td>
                    <td className="py-3 text-slate-700">$ 0.26</td>
                    <td className="py-3 text-slate-700">{Math.ceil(formQty / 5).toLocaleString()}.00 PCS</td>
                    <td className="py-3 text-slate-800 font-bold">$ {(Math.ceil(formQty / 5) * 0.26).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-semibold">2</td>
                    <td className="py-3 text-slate-700">Raw Clay Material</td>
                    <td className="py-3 text-slate-700">1.00 MT</td>
                    <td className="py-3 text-slate-700">$ 2.10</td>
                    <td className="py-3 text-slate-700">{formQty.toLocaleString()}.00 MT</td>
                    <td className="py-3 text-slate-800 font-bold">$ {(formQty * 2.10).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg text-xs transition">Save Order</button>
              <button type="button" onClick={() => setLayoutMode("list")} className="border border-slate-200 text-slate-700 font-bold px-6 py-2 rounded-lg text-xs hover:bg-slate-50 transition">Discard</button>
            </div>
          </form>
        </div>

        {/* Brand Copyright */}
        <div className="text-center py-4 border-t border-slate-100 text-[10px] text-slate-400 font-semibold tracking-wide">
          Copyright 2026 © ROCKEYE. All Rights Reserved.
        </div>
      </div>
    );
  };

  // ── RENDER COMPONENT: High-Fidelity Listing Layout (From Screenshot) ──
  const renderListingLayout = () => {
    const kpis = getModuleKPIs(activeTab);
    const headers = getTableHeaders(activeTab);
    const items = getRouteItems(activeTab);

    return (
      <div className="space-y-6 text-[#030213]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {/* Breadcrumbs & Listing Title Bar */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
              <span>{selectedRole.label}</span>
              <ChevronRight size={10} />
              <span className="text-slate-600">{activeTab}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 leading-none">Listing</h1>
          </div>
          <button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
            <RefreshCw size={13} className="animate-spin-slow" /> Sync Elastic Data
          </button>
        </div>

        {/* KPI Stats Row (Redesigned matching new screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, idx) => (
            <NewKPICard
              key={idx}
              label={kpi.label}
              value={kpi.value}
              sub="vs last month"
              icon={BarChart3}
              color="#3b82f6"
              trend={idx % 2 === 0 ? "↗ 12%" : "↗ 8%"}
            />
          ))}
        </div>

        {/* Standardized Data Table Container */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden flex flex-col justify-between min-h-[400px]">
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-5 py-3.5 text-left w-12">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </th>
                  {headers.map(h => (
                    <th key={h} className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider px-5 py-3.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((o, idx) => (
                  <tr key={o.id} className={`border-b border-slate-100 last:border-0 hover:bg-blue-50/10 transition-colors ${idx % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                    <td className="px-5 py-3.5 w-12">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    </td>
                    {renderTableRow(activeTab, o)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="border-t border-slate-100 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <span className="text-xs text-slate-400 font-semibold">View 1 - {items.length} of {items.length}</span>
            <div className="flex items-center gap-1.5">
              <button className="p-1 border border-slate-200 rounded text-slate-400 hover:bg-slate-50 text-xs">{"<"}</button>
              <button className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-bold">1</button>
              <button className="p-1 border border-slate-200 rounded text-slate-400 hover:bg-slate-50 text-xs">{">"}</button>
              <select className="ml-2 px-2 py-1 border border-slate-200 rounded text-xs text-slate-600 bg-white">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brand Copyright */}
        <div className="text-center py-4 border-t border-slate-100 text-[10px] text-slate-400 font-semibold tracking-wide">
          Copyright 2026 © ROCKEYE. All Rights Reserved.
        </div>
      </div>
    );
  };

  const getRouteItems = (route: string) => {
    switch (route) {
      case "orders":
        return orders;
      case "contracts":
        return contracts;
      case "planning":
        return plans;
      case "pos":
        return purchaseOrders;
      case "inspections":
      case "qaapprovals":
        return inspections;
      case "bookings":
      case "allocation":
      case "delivery":
        return haulages;
      default:
        return orders;
    }
  };

  const getTableHeaders = (route: string) => {
    switch (route) {
      case "orders":
        return ["Order ID", "Customer Name", "Production Item", "Packaging", "Destination", "Quantity (MT)", "Status"];
      case "contracts":
        return ["Contract ID", "Order ID", "Customer Name", "Pricing Model", "Terms", "Status"];
      case "planning":
        return ["Plan ID", "Order ID", "Product", "Refinery Plant", "Priority", "Schedule Date", "Status"];
      case "pos":
        return ["PO ID", "Supplier Name", "Raw Material", "Volume Requested", "Status"];
      case "inspections":
      case "qaapprovals":
        return ["Inspection ID", "Order ID", "Product", "FFA %", "Moisture %", "Impurities %", "Status"];
      case "bookings":
      case "allocation":
      case "delivery":
        return ["Haulage ID", "Vessel Name", "Voyage No", "Container Qty", "Allocated Qty", "Driver", "Status"];
      default:
        return ["Resource ID", "Details", "Quantity", "Date", "Status"];
    }
  };

  const renderTableRow = (route: string, o: any) => {
    const defaultClick = () => {
      setSelectedItemId(o.orderId || o.id);
      setLayoutMode("detail");
    };

    switch (route) {
      case "orders":
        return (
          <>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.id}</td>
            <td className="px-5 py-3.5 text-xs text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.customer}</td>
            <td className="px-5 py-3.5 text-xs text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.product}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.packaging}</td>
            <td className="px-5 py-3.5 text-xs text-slate-500">{o.destination}</td>
            <td className="px-5 py-3.5 text-xs font-medium text-slate-800">{o.qty.toFixed(2)} MT</td>
            <td className="px-5 py-3.5">{getStatusBadge(o.status)}</td>
          </>
        );
      case "contracts":
        return (
          <>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.id}</td>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.orderId}</td>
            <td className="px-5 py-3.5 text-xs text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.customer}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.pricing}</td>
            <td className="px-5 py-3.5 text-xs text-slate-500">{o.terms}</td>
            <td className="px-5 py-3.5">{getStatusBadge(o.status)}</td>
          </>
        );
      case "planning":
        return (
          <>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.id}</td>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.orderId}</td>
            <td className="px-5 py-3.5 text-xs text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.product}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.plant}</td>
            <td className="px-5 py-3.5 text-xs font-medium text-slate-600">{o.priority}</td>
            <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{o.scheduleDate}</td>
            <td className="px-5 py-3.5">{getStatusBadge(o.status)}</td>
          </>
        );
      case "pos":
        return (
          <>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.id}</td>
            <td className="px-5 py-3.5 text-xs text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.supplier}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.material}</td>
            <td className="px-5 py-3.5 text-xs font-medium text-slate-800">{o.qty} MT</td>
            <td className="px-5 py-3.5">{getStatusBadge(o.status)}</td>
          </>
        );
      case "inspections":
      case "qaapprovals":
        return (
          <>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.id}</td>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.orderId}</td>
            <td className="px-5 py-3.5 text-xs text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.product}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.ffa}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.moisture}</td>
            <td className="px-5 py-3.5 text-xs text-slate-505">{o.impurities}</td>
            <td className="px-5 py-3.5">{getStatusBadge(o.status)}</td>
          </>
        );
      case "bookings":
      case "allocation":
      case "delivery":
        return (
          <>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.id}</td>
            <td className="px-5 py-3.5 text-xs text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.vessel}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.voyage}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.containerQty}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.allocatedQty}</td>
            <td className="px-5 py-3.5 text-xs text-slate-505">{o.driverName || "Unassigned"}</td>
            <td className="px-5 py-3.5">{getStatusBadge(o.status)}</td>
          </>
        );
      default:
        return (
          <>
            <td className="px-5 py-3.5 text-xs font-mono font-bold text-blue-600 hover:underline cursor-pointer" onClick={defaultClick}>{o.id}</td>
            <td className="px-5 py-3.5 text-xs text-slate-600">{o.customer || "General"}</td>
            <td className="px-5 py-3.5 text-xs font-medium text-slate-800">{o.qty || o.value || "—"}</td>
            <td className="px-5 py-3.5 text-xs text-slate-505">{o.date || "—"}</td>
            <td className="px-5 py-3.5">{getStatusBadge(o.status)}</td>
          </>
        );
    }
  };

  const getModuleKPIs = (route: string) => {
    switch (route) {
      case "orders":
        return [
          { label: "Requested Qty", value: `${(orders.reduce((acc, c) => acc + c.qty, 0) / 1000).toFixed(2)} K` },
          { label: "Pending Qty", value: `${(orders.filter(o => o.status === "Pending").reduce((acc, c) => acc + c.qty, 0) / 1000).toFixed(2)} K` },
          { label: "In Progress Qty", value: `${(orders.filter(o => o.status === "In Production").reduce((acc, c) => acc + c.qty, 0) / 1000).toFixed(2)} K` },
          { label: "Completed Qty", value: `${(orders.filter(o => o.status === "Delivered").reduce((acc, c) => acc + c.qty, 0) / 1000).toFixed(2)} K` },
        ];
      case "contracts":
        return [
          { label: "Total Contracts", value: contracts.length },
          { label: "Pending Contracts", value: contracts.filter(c => c.status === "Pending").length },
          { label: "Active Contracts", value: contracts.filter(c => c.status === "Approved").length },
          { label: "Completed Contracts", value: orders.filter(o => o.status === "Delivered").length },
        ];
      case "planning":
        return [
          { label: "Total Plans", value: plans.length },
          { label: "Pending Plans", value: plans.filter(p => p.status === "Draft").length },
          { label: "Active Plans", value: plans.filter(p => p.status === "Scheduled").length },
          { label: "Completed Plans", value: plans.filter(p => p.status === "Completed").length },
        ];
      case "pos":
        return [
          { label: "Total POs", value: purchaseOrders.length },
          { label: "Draft POs", value: purchaseOrders.filter(po => po.status === "Draft").length },
          { label: "In Progress POs", value: purchaseOrders.filter(po => po.status === "Ordered").length },
          { label: "Received POs", value: purchaseOrders.filter(po => po.status === "Received").length },
        ];
      default:
        return [
          { label: "Requested Qty", value: orders.length },
          { label: "Pending Qty", value: pendingOrdersCount },
          { label: "In Progress Qty", value: orders.filter(o => o.status === "In Production").length },
          { label: "Completed Qty", value: orders.filter(o => o.status === "Delivered").length },
        ];
    }
  };

  // ── Main Layout Workspace ──
  const renderWorkspace = () => {
    if (activeTab === "dashboard") {
      return (
        <div className="space-y-6">
          {/* Row 1: Redesigned KPI Cards matching the screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NewKPICard label="Total Orders" value={orders.length} sub="vs last month" icon={ShoppingCart} color="#3b82f6" trend="↗ 12%" />
            <NewKPICard label="Pending Contracts" value={pendingContractsCount} sub="vs last month" icon={FileText} color="#a855f7" trend="↗ 8%" />
            <NewKPICard label="In Production" value={orders.filter(o => o.status === "In Production").length} sub="vs last month" icon={Factory} color="#06b6d4" trend="↘ 3%" />
            <NewKPICard label="Completed Orders" value={orders.filter(o => o.status === "Delivered").length} sub="vs last month" icon={CheckCircle} color="#10b981" trend="↗ 15%" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-4"> Sarawak Export Volume Trend (MT/month)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[
                  { month: "Jan", CPO: 4000, Olein: 2400 },
                  { month: "Feb", CPO: 3000, Olein: 1398 },
                  { month: "Mar", CPO: 2000, Olein: 9800 },
                  { month: "Apr", CPO: 2780, Olein: 3908 },
                  { month: "May", CPO: 1890, Olein: 4800 },
                  { month: "Jun", CPO: 2390, Olein: 3800 },
                  { month: "Jul", CPO: 3490, Olein: 4300 }
                ]}>
                  <defs>
                    <linearGradient id="cpoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="CPO" stroke="#2563eb" strokeWidth={2} fill="url(#cpoGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5">
              <h3 className="font-semibold text-slate-800 text-sm mb-4">Task Queue</h3>
              <div className="space-y-4">
                {orders.filter(o => o.status !== "Delivered").slice(0, 3).map(o => (
                  <div key={o.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Clock size={16} className="text-amber-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{o.id}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{o.status}</p>
                    </div>
                    <button onClick={() => { setActiveTab(categories[0]?.items[0]?.route ?? "orders"); setSelectedItemId(o.id); setLayoutMode("detail"); }} className="ml-auto text-[10px] bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (layoutMode === "detail") {
      return renderDetailsScreen();
    }

    if (layoutMode === "add") {
      return renderAddFormScreen();
    }

    return renderListingLayout();
  };

  const getHeaderLogoLabel = () => {
    switch (selectedRole.id) {
      case "sales": return "Sales";
      case "finance": return "Finance";
      case "planning": return "Planning";
      case "procurement": return "Procurement";
      case "production": return "Production";
      case "qa": return "Quality";
      case "export": return "Export Doc";
      case "logistics": return "Haulage";
      default: return "Customer";
    }
  };

  const getAddButtonLabel = () => {
    if (selectedRole.id === "customer" && activeTab === "orders") {
      return "+ Add Customer Orders";
    }
    if (selectedRole.id === "sales" && activeTab === "orders") {
      return "+ Add Customer Orders";
    }
    if (selectedRole.id === "planning" && activeTab === "planning") {
      return "+ Add Production Plans";
    }
    if (selectedRole.id === "procurement" && activeTab === "pos") {
      return "+ Add Purchase Orders";
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col text-slate-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Header bar */}
      <header className="h-14 bg-white border-b border-slate-100 flex items-center px-5 justify-between z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <div className="text-left leading-none">
              <span className="text-[10px] text-slate-400 font-bold tracking-wider block">ROCKEYE</span>
              <span className="text-sm font-extrabold text-slate-800">{getHeaderLogoLabel()}</span>
            </div>
          </div>
        </div>

        {/* Header Search matching screenshot */}
        <div className="flex-1 max-w-md mx-6 hidden lg:flex items-center gap-0 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 px-3 py-1.5">
          <Search size={14} className="text-slate-400 mr-2" />
          <input placeholder="Search employees, leave requests, attendance..." className="w-full bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none" />
          <span className="text-[9px] font-bold text-slate-400 bg-slate-200/60 px-1 py-0.5 rounded ml-2">Ctrl+K</span>
        </div>

        {/* Right side actions, notification badge */}
        <div className="flex items-center gap-4">
          {getAddButtonLabel() && layoutMode === "list" && (
            <button onClick={() => setLayoutMode("add")} className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5">
              <Plus size={13} /> {getAddButtonLabel()}
            </button>
          )}

          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
            </button>

            {/* User Profile initials */}
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center ml-1">
              DP
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar matching screenshot */}
        {sidebarOpen && (
          <aside className="w-64 bg-white border-r border-slate-100 flex flex-col flex-shrink-0 justify-between">
            <div className="pt-2">
              {/* Sidebar items */}
              <div className="py-3 px-2 space-y-3">
                {/* Dashboard button */}
                <button
                  onClick={() => { setActiveTab("dashboard"); setSelectedItemId(null); setLayoutMode("list"); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === "dashboard" ? "bg-blue-50/80 text-blue-600 font-bold" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  <LayoutDashboard size={15} /> Dashboard
                </button>

                {/* Collapsible Categories */}
                {categories.map((cat, cIdx) => {
                  const isCollapsed = collapsedCategories[cat.title];
                  return (
                    <div key={cIdx} className="space-y-1">
                      <button
                        onClick={() => toggleCategory(cat.title)}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 text-left"
                      >
                        {cat.title}
                        {isCollapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                      </button>

                      {!isCollapsed && (
                        <div className="space-y-0.5 pl-2 border-l border-slate-100 ml-3.5">
                          {cat.items.map(item => (
                            <button
                              key={item.label}
                              onClick={() => { setActiveTab(item.route); setSelectedItemId(null); setLayoutMode("list"); }}
                              className={`w-full flex items-center gap-2 py-1.5 rounded-lg text-[13px] font-semibold text-left transition-colors ${activeTab === item.route ? "text-blue-600 font-bold" : "text-slate-500 hover:text-blue-600"}`}
                            >
                              <span className="text-slate-300">•</span> {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profile Footer matching screenshot */}
            <div className="border-t border-slate-100 p-3 bg-white relative">
              {profileMenuOpen && (
                <div className="absolute bottom-14 left-3 right-3 bg-white border border-slate-200 rounded-lg shadow-xl py-1.5 z-30 text-xs font-semibold text-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <button
                    onClick={() => { setScreen("role"); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left text-slate-700 transition-colors"
                  >
                    <RefreshCw size={13} className="text-slate-400" /> Switch Role
                  </button>
                  <button
                    onClick={() => { setScreen("email"); setProfileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left text-red-600 transition-colors border-t border-slate-100"
                  >
                    <LogOut size={13} className="text-red-400" /> Sign Out
                  </button>
                </div>
              )}
              <div 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center">
                    DP
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 leading-none truncate">Demo PalmOil</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1 truncate">sarawak.ops@rockeye.com</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-slate-600" title="Profile Menu">
                  {profileMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Workspace */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f8fafc]">
          {renderWorkspace()}
        </main>
      </div>
    </div>
  );
}
