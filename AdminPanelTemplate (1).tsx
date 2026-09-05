"use client"

import React, { useState, useMemo } from "react"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  Store,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  RefreshCcw,
  Download,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronDown,
  Filter,
  ArrowLeft,
  Upload,
  Save,
  Shield,
  Clock,
  Check,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText
} from "lucide-react"

// ==========================================
// 1. TIPOS Y CONTRATOS DE DATOS (DATA MODELS)
// ==========================================

export type AdminTab =
  | "dashboard"
  | "products"
  | "categories"
  | "brands"
  | "orders"
  | "payments"
  | "users"
  | "settings"

export interface ProductItem {
  id: string
  name: string
  slug: string
  category: string
  brand: string
  price: number
  comparePrice?: number | null
  stock: number
  images: string[]
  isNew: boolean
  isFeatured: boolean
  isActive: boolean
  description?: string
  createdAt: string
}

export interface CategoryItem {
  id: string
  name: string
  slug: string
  icon?: string
  productCount: number
}

export interface BrandItem {
  id: string
  name: string
  slug: string
  logo?: string
  productCount: number
}

export interface OrderItem {
  id: string
  orderNumber: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shipping: number
  total: number
  paymentMethod: "CARD" | "TRANSFER" | "WALLET" | "CASH_ON_DELIVERY"
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  items: {
    name: string
    quantity: number
    price: number
    total: number
    image: string
  }[]
  createdAt: string
}

export interface PaymentItem {
  id: string
  orderId: string
  userName: string
  userEmail: string
  amount: number
  method: "card" | "transfer" | "wallet"
  status: "completed" | "pending" | "failed" | "refunded"
  date: string
}

export interface UserItem {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MODERATOR" | "CUSTOMER"
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED"
  ordersCount: number
  totalSpent: number
  createdAt: string
}

// ==========================================
// 2. DATOS MOCK INICIALES (MOCK SEED)
// ==========================================

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: "prod-1",
    name: "Plancha de Gypsum Standard 1/2\"",
    slug: "plancha-gypsum-standard-1-2",
    category: "Gypsum y Placas",
    brand: "Knauf",
    price: 12.5,
    comparePrice: 14.0,
    stock: 140,
    images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop"],
    isNew: false,
    isFeatured: true,
    isActive: true,
    description: "Plancha de yeso cartón para interiores de alta resistencia.",
    createdAt: "2026-02-15",
  },
  {
    id: "prod-2",
    name: "Perfil Omega Galvanizado 0.45mm",
    slug: "perfil-omega-galvanizado-0-45",
    category: "Perfiles de Acero",
    brand: "Novacero",
    price: 3.25,
    comparePrice: null,
    stock: 85,
    images: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    description: "Perfil metálico galvanizado para armado de estructura de cielo raso.",
    createdAt: "2026-02-18",
  },
  {
    id: "prod-3",
    name: "Panel Acústico Ranurado WPC Roble",
    slug: "panel-acustico-ranurado-wpc-roble",
    category: "Revestimientos WPC",
    brand: "DecoPanel",
    price: 28.9,
    comparePrice: 34.5,
    stock: 22,
    images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&h=200&fit=crop"],
    isNew: true,
    isFeatured: true,
    isActive: true,
    description: "Panel de listones de madera sintética para decoración y absorción acústica.",
    createdAt: "2026-02-20",
  },
  {
    id: "prod-4",
    name: "Lámina Mármol PVC UV 2.44x1.22m",
    slug: "lamina-marmol-pvc-uv",
    category: "Mármol PVC",
    brand: "DecoPanel",
    price: 45.0,
    comparePrice: 52.0,
    stock: 12,
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop"],
    isNew: false,
    isFeatured: true,
    isActive: true,
    description: "Lámina decorativa imitación mármol con protección UV para paredes.",
    createdAt: "2026-02-22",
  },
  {
    id: "prod-5",
    name: "Tornillos Drywall 6x1 Punta Fina (Caja 1000u)",
    slug: "tornillos-drywall-6x1-punta-fina",
    category: "Fijaciones y Tornillos",
    brand: "Gyplac",
    price: 6.8,
    comparePrice: null,
    stock: 65,
    images: ["https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200&h=200&fit=crop"],
    isNew: false,
    isFeatured: false,
    isActive: true,
    description: "Tornillo autorroscante para fijación de planchas de yeso a estructura metálica.",
    createdAt: "2026-02-24",
  },
]

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: "cat-1", name: "Gypsum y Placas", slug: "gypsum-y-placas", icon: "Package", productCount: 8 },
  { id: "cat-2", name: "Perfiles de Acero", slug: "perfiles-de-acero", icon: "Building2", productCount: 6 },
  { id: "cat-3", name: "Revestimientos WPC", slug: "revestimientos-wpc", icon: "FolderTree", productCount: 4 },
  { id: "cat-4", name: "Mármol PVC", slug: "marmol-pvc", icon: "FolderTree", productCount: 3 },
  { id: "cat-5", name: "Fijaciones y Tornillos", slug: "fijaciones-y-tornillos", icon: "Tag", productCount: 5 },
]

const INITIAL_BRANDS: BrandItem[] = [
  { id: "brand-1", name: "Knauf", slug: "knauf", logo: "K", productCount: 8 },
  { id: "brand-2", name: "Novacero", slug: "novacero", logo: "N", productCount: 6 },
  { id: "brand-3", name: "DecoPanel", slug: "decopanel", logo: "D", productCount: 7 },
  { id: "brand-4", name: "Gyplac", slug: "gyplac", logo: "G", productCount: 5 },
]

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-2026-001",
    customer: {
      name: "Carlos Mendoza",
      email: "carlos.mendoza@gmail.com",
      phone: "+593 98 443 2190",
    },
    status: "processing",
    subtotal: 185.5,
    shipping: 12.0,
    total: 197.5,
    paymentMethod: "TRANSFER",
    shippingAddress: {
      name: "Carlos Mendoza",
      address: "Av. 12 de Octubre y Cordero",
      city: "Quito",
      state: "Pichincha",
      zipCode: "170143",
    },
    items: [
      {
        name: "Plancha de Gypsum Standard 1/2\"",
        quantity: 10,
        price: 12.5,
        total: 125.0,
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop",
      },
      {
        name: "Tornillos Drywall 6x1 Punta Fina (Caja 1000u)",
        quantity: 2,
        price: 6.8,
        total: 13.6,
        image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=200&h=200&fit=crop",
      },
      {
        name: "Lámina Mármol PVC UV 2.44x1.22m",
        quantity: 1,
        price: 45.0,
        total: 45.0,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop",
      },
    ],
    createdAt: "2026-02-28 10:45",
  },
  {
    id: "ord-2",
    orderNumber: "ORD-2026-002",
    customer: {
      name: "Ana Belén Paredes",
      email: "ana.paredes@constructora.ec",
      phone: "+593 99 711 9881",
    },
    status: "delivered",
    subtotal: 345.0,
    shipping: 15.0,
    total: 360.0,
    paymentMethod: "CARD",
    shippingAddress: {
      name: "Ana Belén Paredes",
      address: "Urbanización Los Ceibos Mz 14",
      city: "Guayaquil",
      state: "Guayas",
      zipCode: "090150",
    },
    items: [
      {
        name: "Panel Acústico Ranurado WPC Roble",
        quantity: 10,
        price: 28.9,
        total: 289.0,
        image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&h=200&fit=crop",
      },
    ],
    createdAt: "2026-02-27 15:20",
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2026-003",
    customer: {
      name: "Estudio Arquitectura Vértice",
      email: "proyectos@vertice.ec",
      phone: "+593 95 123 4567",
    },
    status: "pending",
    subtotal: 98.0,
    shipping: 8.0,
    total: 106.0,
    paymentMethod: "CARD",
    shippingAddress: {
      name: "Arq. Marcelo Dávila",
      address: "Calle Larga y Huayna Cápac",
      city: "Cuenca",
      state: "Azuay",
      zipCode: "010101",
    },
    items: [
      {
        name: "Perfil Omega Galvanizado 0.45mm",
        quantity: 20,
        price: 3.25,
        total: 65.0,
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop",
      },
    ],
    createdAt: "2026-02-28 11:30",
  },
]

const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    id: "PAY-9812",
    orderId: "ORD-2026-001",
    userName: "Carlos Mendoza",
    userEmail: "carlos.mendoza@gmail.com",
    amount: 197.5,
    method: "transfer",
    status: "completed",
    date: "2026-02-28 10:48",
  },
  {
    id: "PAY-9811",
    orderId: "ORD-2026-002",
    userName: "Ana Belén Paredes",
    userEmail: "ana.paredes@constructora.ec",
    amount: 360.0,
    method: "card",
    status: "completed",
    date: "2026-02-27 15:21",
  },
  {
    id: "PAY-9810",
    orderId: "ORD-2026-003",
    userName: "Estudio Arquitectura Vértice",
    userEmail: "proyectos@vertice.ec",
    amount: 106.0,
    method: "card",
    status: "pending",
    date: "2026-02-28 11:30",
  },
]

const INITIAL_USERS: UserItem[] = [
  {
    id: "usr-1",
    name: "Antony Zumba (Super Admin)",
    email: "admin@tumbadoszumba.com",
    role: "ADMIN",
    status: "ACTIVE",
    ordersCount: 14,
    totalSpent: 2840.0,
    createdAt: "2026-01-01",
  },
  {
    id: "usr-2",
    name: "Carlos Mendoza",
    email: "carlos.mendoza@gmail.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    ordersCount: 3,
    totalSpent: 590.25,
    createdAt: "2026-01-15",
  },
  {
    id: "usr-3",
    name: "Ana Belén Paredes",
    email: "ana.paredes@constructora.ec",
    role: "CUSTOMER",
    status: "ACTIVE",
    ordersCount: 6,
    totalSpent: 1840.5,
    createdAt: "2026-01-20",
  },
  {
    id: "usr-4",
    name: "Constructora Loja Sur",
    email: "compras@lojasur.ec",
    role: "CUSTOMER",
    status: "INACTIVE",
    ordersCount: 0,
    totalSpent: 0.0,
    createdAt: "2026-02-10",
  },
]

// ==========================================
// 3. COMPONENTE MAESTRO DEL PANEL DE ADMIN
// ==========================================

export default function AdminPanelTemplate() {
  // Estado de navegación activa
  const [currentTab, setCurrentTab] = useState<AdminTab>("dashboard")

  // Estados de datos principales
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS)
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES)
  const [brands, setBrands] = useState<BrandItem[]>(INITIAL_BRANDS)
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS)
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS)
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS)

  // Filtros y búsquedas
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [userRoleFilter, setUserRoleFilter] = useState("all")

  // Modales y Diálogos
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null)
  const [deleteProductConfirmId, setDeleteProductConfirmId] = useState<string | null>(null)

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null)

  const [brandModalOpen, setBrandModalOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null)
  const [brandToDelete, setBrandToDelete] = useState<BrandItem | null>(null)

  const [orderDetailModal, setOrderDetailModal] = useState<OrderItem | null>(null)
  const [userModalOpen, setUserModalOpen] = useState(false)

  // Feedback Notification Toast simulado
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Métricas calculadas para Dashboard y Widgets
  const dashboardStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0)
    const totalOrders = orders.length
    const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length
    const totalProducts = products.length

    const statusCounts = {
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "processing").length,
      shipped: orders.filter((o) => o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    }

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      statusCounts,
    }
  }, [orders, users, products])

  // Menú de Navegación Lateral (Sidebar Items)
  const navItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "products", name: "Productos", icon: Package },
    { id: "categories", name: "Categorias", icon: FolderTree },
    { id: "brands", name: "Marcas", icon: Tag },
    { id: "orders", name: "Ordenes", icon: ShoppingCart },
    { id: "payments", name: "Pagos", icon: CreditCard },
    { id: "users", name: "Usuarios", icon: Users },
    { id: "settings", name: "Configuracion", icon: Settings },
  ] as const

  // ----------------------------------------------------
  // MANEJADORES DE ACCIONES (HANDLERS)
  // ----------------------------------------------------

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get("name") as string
    const slug = (form.get("slug") as string) || name.toLowerCase().replace(/\s+/g, "-")
    const price = parseFloat(form.get("price") as string) || 0
    const comparePriceVal = form.get("comparePrice") as string
    const comparePrice = comparePriceVal ? parseFloat(comparePriceVal) : null
    const stock = parseInt(form.get("stock") as string, 10) || 0
    const category = form.get("category") as string
    const brand = form.get("brand") as string
    const description = form.get("description") as string
    const isNew = form.get("isNew") === "on"
    const isFeatured = form.get("isFeatured") === "on"

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name,
                slug,
                price,
                comparePrice,
                stock,
                category,
                brand,
                description,
                isNew,
                isFeatured,
              }
            : p
        )
      )
      showToast(`Producto "${name}" actualizado con éxito`)
    } else {
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
        name,
        slug,
        category,
        brand,
        price,
        comparePrice,
        stock,
        images: ["https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop"],
        isNew,
        isFeatured,
        isActive: true,
        description,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setProducts((prev) => [newProd, ...prev])
      showToast(`Producto "${name}" creado exitosamente`)
    }
    setProductModalOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleteProductConfirmId(null)
    showToast("Producto eliminado del catálogo")
  }

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderItem["status"]) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
    showToast(`Orden #${orderId} actualizada a ${newStatus.toUpperCase()}`)
  }

  return (
    <div className="min-h-screen bg-[#121212] text-zinc-100 flex font-sans antialiased selection:bg-[#F47B20] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900 border border-[#F47B20]/40 text-white px-4 py-3 rounded-lg shadow-xl shadow-black/50 animate-bounce">
          <CheckCircle2 className="h-5 w-5 text-[#F47B20]" strokeWidth={1.75} />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SIDEBAR LATERAL (REPLICA EXACTA CON TOKEN NARANJA Y ESTILO)   */}
      {/* ============================================================ */}
      <aside className="w-64 bg-[#18181b] border-r border-zinc-800 flex flex-col fixed inset-y-0 z-30">
        {/* Brand Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-800">
          <div className="h-8 w-8 rounded-lg bg-[#0A3580] flex items-center justify-center font-bold text-white text-xs border border-blue-400/20 shadow-sm">
            TZ
          </div>
          <span className="font-bold text-base tracking-tight text-white">Admin Panel</span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id)
                  setSearchQuery("")
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#F47B20] text-white shadow-md shadow-[#F47B20]/20"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        {/* Back to Store Footer */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={() => showToast("Redirigiendo a la tienda pública...")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium border border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <div className="h-5 w-5 rounded-full bg-zinc-700 text-xs flex items-center justify-center font-bold text-zinc-300">
              N
            </div>
            <span>Volver a la Tienda</span>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* CONTENEDOR PRINCIPAL DE CONTENIDO                            */}
      {/* ============================================================ */}
      <main className="pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-zinc-800 bg-[#18181b]/60 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              MODO ADMINISTRADOR
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#0A3580] to-[#F47B20] flex items-center justify-center text-xs font-bold text-white">
                AZ
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-zinc-200">Antony Zumba</p>
                <p className="text-[11px] text-zinc-400">admin@tumbadoszumba.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Body View Container */}
        <div className="p-8 space-y-6 flex-1">
          {/* ======================================================== */}
          {/* VISTA 1: DASHBOARD (REPLICA EXACTA DE LA CAPTURA)         */}
          {/* ======================================================== */}
          {currentTab === "dashboard" && (
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
                <p className="text-sm text-zinc-400 mt-1">
                  Bienvenido al panel de administracion de TumbadosZumba
                </p>
              </div>

              {/* 4 KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Ingresos Totales */}
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-400">Ingresos Totales</span>
                    <DollarSign className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
                      $ {dashboardStats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </h2>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                      <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} />
                      +0% vs mes anterior
                    </p>
                  </div>
                </div>

                {/* 2. Pedidos */}
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-400">Pedidos</span>
                    <ShoppingCart className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
                      {dashboardStats.totalOrders}
                    </h2>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                      <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} />
                      +0% vs mes anterior
                    </p>
                  </div>
                </div>

                {/* 3. Clientes */}
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 shadow-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-400">Clientes</span>
                    <Users className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
                      {dashboardStats.totalCustomers}
                    </h2>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                      <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} />
                      +0% vs mes anterior
                    </p>
                  </div>
                </div>

                {/* 4. Productos */}
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-zinc-400">Productos</span>
                    <Package className="h-4 w-4 text-zinc-400" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
                      {dashboardStats.totalProducts}
                    </h2>
                    <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                      <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.75} />
                      +0% vs mes anterior
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom 2-Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Pedidos Recientes (Colspan 4) */}
                <div className="lg:col-span-4 bg-[#18181b] border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Pedidos Recientes</h3>
                      <p className="text-xs text-zinc-400">Los ultimos pedidos de tu tienda</p>
                    </div>
                    <button
                      onClick={() => setCurrentTab("orders")}
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 border border-zinc-700 bg-zinc-800/60 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Ver todos
                      <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" strokeWidth={1.75} />
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-14 text-center text-sm text-zinc-500">
                      No hay pedidos recientes
                    </div>
                  ) : (
                    <div className="divide-y divide-zinc-800">
                      {orders.slice(0, 4).map((order) => (
                        <div key={order.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-[#F47B20] border border-zinc-700">
                              {order.customer.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-zinc-200">{order.customer.name}</p>
                              <p className="text-xs text-zinc-400 font-mono">{order.orderNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                                order.status === "delivered"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                  : order.status === "processing"
                                  ? "bg-blue-950 text-blue-300 border border-blue-800"
                                  : order.status === "pending"
                                  ? "bg-amber-950 text-amber-300 border border-amber-800"
                                  : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                              }`}
                            >
                              {order.status.toUpperCase()}
                            </span>
                            <span className="text-sm font-bold text-white font-mono">
                              $ {order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resumen de Pedidos (Colspan 3) */}
                <div className="lg:col-span-3 bg-[#18181b] border border-zinc-800 rounded-xl p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Resumen de Pedidos</h3>
                    <p className="text-xs text-zinc-400">Estado de los pedidos en tu tienda</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* Pendientes */}
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-zinc-800/60">
                      <span className="text-zinc-300">Pendientes</span>
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono font-semibold flex items-center justify-center text-zinc-300">
                        {dashboardStats.statusCounts.pending}
                      </span>
                    </div>
                    {/* Procesando */}
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-zinc-800/60">
                      <span className="text-zinc-300">Procesando</span>
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-blue-950/80 border border-blue-700 text-xs font-mono font-semibold flex items-center justify-center text-blue-300">
                        {dashboardStats.statusCounts.processing}
                      </span>
                    </div>
                    {/* Enviados */}
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-zinc-800/60">
                      <span className="text-zinc-300">Enviados</span>
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-blue-950/80 border border-blue-700 text-xs font-mono font-semibold flex items-center justify-center text-blue-300">
                        {dashboardStats.statusCounts.shipped}
                      </span>
                    </div>
                    {/* Entregados */}
                    <div className="flex items-center justify-between text-sm py-1.5 border-b border-zinc-800/60">
                      <span className="text-zinc-300">Entregados</span>
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-[#F47B20]/20 border border-[#F47B20] text-xs font-mono font-semibold flex items-center justify-center text-[#F47B20]">
                        {dashboardStats.statusCounts.delivered}
                      </span>
                    </div>
                    {/* Cancelados */}
                    <div className="flex items-center justify-between text-sm py-1.5">
                      <span className="text-zinc-300">Cancelados</span>
                      <span className="h-5 min-w-5 px-1.5 rounded-full bg-rose-950/80 border border-rose-700 text-xs font-mono font-semibold flex items-center justify-center text-rose-300">
                        {dashboardStats.statusCounts.cancelled}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 2: PRODUCTOS (CATÁLOGO, GESTIÓN, PRECIO Y STOCK)    */}
          {/* ======================================================== */}
          {currentTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Productos</h1>
                  <p className="text-sm text-zinc-400">
                    Administra el catálogo de materiales y precios de venta
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null)
                    setProductModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F47B20] hover:bg-[#F47B20]/90 text-white font-medium text-sm shadow-md shadow-[#F47B20]/20 transition-all"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                  Nuevo Producto
                </button>
              </div>

              {/* Filtros Bar */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.75} />
                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#F47B20]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#F47B20]"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tabla de Productos */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400">
                    <tr>
                      <th className="p-4 w-16">Imagen</th>
                      <th className="p-4">Producto</th>
                      <th className="p-4">Categoría</th>
                      <th className="p-4">Marca</th>
                      <th className="p-4">Precio</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {products
                      .filter((p) => {
                        const matchesSearch =
                          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.slug.toLowerCase().includes(searchQuery.toLowerCase())
                        const matchesCat = categoryFilter === "all" || p.category === categoryFilter
                        return matchesSearch && matchesCat
                      })
                      .map((product) => (
                        <tr key={product.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-4">
                            <img
                              src={product.images[0] || "/iconozumba.png"}
                              alt={product.name}
                              className="h-10 w-10 rounded-md object-cover border border-zinc-700"
                            />
                          </td>
                          <td className="p-4 font-medium text-white">
                            <div>{product.name}</div>
                            <div className="text-xs text-zinc-500 font-mono">{product.slug}</div>
                          </td>
                          <td className="p-4 text-xs text-zinc-300">{product.category}</td>
                          <td className="p-4 text-xs text-zinc-300">{product.brand}</td>
                          <td className="p-4 font-mono font-semibold text-white">
                            $ {product.price.toFixed(2)}
                            {product.comparePrice && product.comparePrice > product.price && (
                              <span className="block text-[11px] text-zinc-500 line-through">
                                $ {product.comparePrice.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-mono font-medium ${
                                product.stock > 20
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/60"
                                  : product.stock > 0
                                  ? "bg-amber-950/60 text-amber-400 border border-amber-800/60"
                                  : "bg-rose-950/60 text-rose-400 border border-rose-800/60"
                              }`}
                            >
                              {product.stock} un.
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {product.isActive ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingProduct(product)
                                setProductModalOpen(true)
                              }}
                              className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                            >
                              <Pencil className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                            <button
                              onClick={() => setDeleteProductConfirmId(product.id)}
                              className="p-1.5 rounded-md hover:bg-rose-950/40 text-rose-400 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 3: CATEGORÍAS (JERARQUÍA Y CONTEO)                 */}
          {/* ======================================================== */}
          {currentTab === "categories" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Categorías</h1>
                  <p className="text-sm text-zinc-400">
                    Estructura del catálogo y clasificación de acabados
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory(null)
                    setCategoryModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F47B20] hover:bg-[#F47B20]/90 text-white font-medium text-sm shadow-md shadow-[#F47B20]/20 transition-all"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                  Nueva Categoría
                </button>
              </div>

              <div className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400">
                    <tr>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Productos Asociados</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4 font-semibold text-white flex items-center gap-3">
                          <FolderTree className="h-4 w-4 text-[#F47B20]" strokeWidth={1.75} />
                          {cat.name}
                        </td>
                        <td className="p-4 font-mono text-xs text-zinc-400">{cat.slug}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300">
                            {cat.productCount} productos
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingCategory(cat)
                              setCategoryModalOpen(true)
                            }}
                            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-1.5 rounded-md hover:bg-rose-950/40 text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 4: MARCAS                                          */}
          {/* ======================================================== */}
          {currentTab === "brands" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Marcas</h1>
                  <p className="text-sm text-zinc-400">
                    Proveedores y fabricantes de construcción en seco
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingBrand(null)
                    setBrandModalOpen(true)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F47B20] hover:bg-[#F47B20]/90 text-white font-medium text-sm shadow-md shadow-[#F47B20]/20 transition-all"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                  Nueva Marca
                </button>
              </div>

              <div className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400">
                    <tr>
                      <th className="p-4">Logo / Sigla</th>
                      <th className="p-4">Nombre</th>
                      <th className="p-4">Slug</th>
                      <th className="p-4">Productos Registrados</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {brands.map((brand) => (
                      <tr key={brand.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4">
                          <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-[#F47B20]">
                            {brand.logo || brand.name.substring(0, 1)}
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-white">{brand.name}</td>
                        <td className="p-4 font-mono text-xs text-zinc-400">{brand.slug}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300">
                            {brand.productCount} productos
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingBrand(brand)
                              setBrandModalOpen(true)
                            }}
                            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Pencil className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => setBrandToDelete(brand)}
                            className="p-1.5 rounded-md hover:bg-rose-950/40 text-rose-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 5: ÓRDENES / PEDIDOS (CON MODAL DE DETALLE)        */}
          {/* ======================================================== */}
          {currentTab === "orders" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Órdenes</h1>
                  <p className="text-sm text-zinc-400">
                    Supervisa despachos, entregas y estados de compra
                  </p>
                </div>
                <button
                  onClick={() => showToast("Órdenes sincronizadas con la base de datos")}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <RefreshCcw className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Actualizar
                </button>
              </div>

              {/* Filtros de Ordenes */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.75} />
                  <input
                    type="text"
                    placeholder="Buscar por cliente o # orden..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#F47B20]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#F47B20]"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="processing">Procesando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Tabla de Ordenes */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400">
                    <tr>
                      <th className="p-4"># Orden</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Método</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 text-right">Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {orders
                      .filter((o) => {
                        const matchesSearch =
                          o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
                        const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter
                        return matchesSearch && matchesStatus
                      })
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="p-4 font-mono font-semibold text-[#F47B20]">{order.orderNumber}</td>
                          <td className="p-4 font-medium text-white">
                            <div>{order.customer.name}</div>
                            <div className="text-xs text-zinc-500">{order.customer.email}</div>
                          </td>
                          <td className="p-4 text-xs text-zinc-400">{order.createdAt}</td>
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleUpdateOrderStatus(order.id, e.target.value as OrderItem["status"])
                              }
                              className="bg-zinc-900 border border-zinc-700 rounded-md px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-[#F47B20]"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="processing">Procesando</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </td>
                          <td className="p-4 text-xs font-mono">{order.paymentMethod}</td>
                          <td className="p-4 font-mono font-bold text-white">$ {order.total.toFixed(2)}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setOrderDetailModal(order)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5 text-[#F47B20]" strokeWidth={1.75} />
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 6: PAGOS                                           */}
          {/* ======================================================== */}
          {currentTab === "payments" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Pagos</h1>
                  <p className="text-sm text-zinc-400">
                    Historial de transacciones, liquidaciones y pasarelas
                  </p>
                </div>
                <button
                  onClick={() => showToast("Exportando CSV de pagos...")}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Exportar CSV
                </button>
              </div>

              {/* Payments Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5">
                  <span className="text-xs text-zinc-400 font-medium">Total Procesado</span>
                  <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">$ 663.50</p>
                </div>
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5">
                  <span className="text-xs text-zinc-400 font-medium">Pagos Pendientes</span>
                  <p className="text-2xl font-bold text-amber-400 font-mono mt-1">$ 106.00</p>
                </div>
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-5">
                  <span className="text-xs text-zinc-400 font-medium">Reembolsos</span>
                  <p className="text-2xl font-bold text-zinc-400 font-mono mt-1">$ 0.00</p>
                </div>
              </div>

              {/* Tabla de Pagos */}
              <div className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400">
                    <tr>
                      <th className="p-4">ID Transacción</th>
                      <th className="p-4"># Orden</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Método</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Monto</th>
                      <th className="p-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4 font-mono font-semibold text-white">{p.id}</td>
                        <td className="p-4 font-mono text-xs text-zinc-400">{p.orderId}</td>
                        <td className="p-4 text-zinc-200">{p.userName}</td>
                        <td className="p-4 text-xs font-mono uppercase">{p.method}</td>
                        <td className="p-4 text-xs text-zinc-400">{p.date}</td>
                        <td className="p-4 font-mono font-bold text-white">$ {p.amount.toFixed(2)}</td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              p.status === "completed"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-amber-950 text-amber-400 border border-amber-800"
                            }`}
                          >
                            {p.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 7: USUARIOS / CLIENTES                            */}
          {/* ======================================================== */}
          {currentTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Usuarios</h1>
                  <p className="text-sm text-zinc-400">
                    Administra cuentas de clientes, permisos y accesos
                  </p>
                </div>
                <button
                  onClick={() => setUserModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F47B20] hover:bg-[#F47B20]/90 text-white font-medium text-sm shadow-md shadow-[#F47B20]/20 transition-all"
                >
                  <Plus className="h-4 w-4" strokeWidth={1.75} />
                  Nuevo Usuario
                </button>
              </div>

              <div className="bg-[#18181b] border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm text-zinc-300">
                  <thead className="bg-zinc-900/80 border-b border-zinc-800 text-xs uppercase font-semibold text-zinc-400">
                    <tr>
                      <th className="p-4">Usuario</th>
                      <th className="p-4">Rol</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Pedidos</th>
                      <th className="p-4">Total Comprado</th>
                      <th className="p-4">Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs text-[#F47B20]">
                            {user.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-white">{user.name}</div>
                            <div className="text-xs text-zinc-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              user.role === "ADMIN"
                                ? "bg-purple-950 text-purple-300 border border-purple-800"
                                : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              user.status === "ACTIVE"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                                : "bg-rose-950 text-rose-400 border border-rose-800"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono">{user.ordersCount}</td>
                        <td className="p-4 font-mono font-bold text-white">$ {user.totalSpent.toFixed(2)}</td>
                        <td className="p-4 text-xs text-zinc-400">{user.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* VISTA 8: CONFIGURACIÓN                                   */}
          {/* ======================================================== */}
          {currentTab === "settings" && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Configuración</h1>
                <p className="text-sm text-zinc-400">
                  Parámetros globales de la tienda, ubicación y monedas
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  showToast("Configuración guardada exitosamente")
                }}
                className="space-y-6"
              >
                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white">Información de la Tienda</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Nombre Comercial</label>
                      <input
                        type="text"
                        defaultValue="TumbadosZumba"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Email de Notificaciones</label>
                      <input
                        type="email"
                        defaultValue="info@tumbadoszumba.com"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Teléfono / WhatsApp</label>
                      <input
                        type="text"
                        defaultValue="0997119881"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Dirección Principal</label>
                      <input
                        type="text"
                        defaultValue="Av. 25 de Agosto y Galápagos"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#18181b] border border-zinc-800 rounded-xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white">Moneda y Zona Horaria</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Moneda Oficial</label>
                      <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]">
                        <option>Dólar Estadounidense ($ USD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-1">Zona Horaria</label>
                      <select className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]">
                        <option>América / Guayaquil (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#F47B20] hover:bg-[#F47B20]/90 text-white font-medium text-sm shadow-md shadow-[#F47B20]/20 transition-all"
                >
                  <Save className="h-4 w-4" strokeWidth={1.75} />
                  Guardar Cambios
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================ */}
      {/* MODALES FLOTANTES (MODALS & DIALOGS)                          */}
      {/* ============================================================ */}

      {/* Modal: Crear / Editar Producto */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h2>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Nombre del Material</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingProduct?.name || ""}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                    placeholder="Ej. Plancha Gypsum 1/2"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Slug URL</label>
                  <input
                    name="slug"
                    defaultValue={editingProduct?.slug || ""}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                    placeholder="auto-generado si queda vacío"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Categoría</label>
                  <select
                    name="category"
                    defaultValue={editingProduct?.category || categories[0]?.name}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Marca</label>
                  <select
                    name="brand"
                    defaultValue={editingProduct?.brand || brands[0]?.name}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Precio Venta ($ USD)</label>
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={editingProduct?.price || ""}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#F47B20]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Precio Anterior / Comparación (Opcional)</label>
                  <input
                    name="comparePrice"
                    type="number"
                    step="0.01"
                    defaultValue={editingProduct?.comparePrice || ""}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#F47B20]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Stock Disponible</label>
                  <input
                    name="stock"
                    type="number"
                    required
                    defaultValue={editingProduct?.stock ?? 10}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-[#F47B20]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 block mb-1">Descripción Técnica</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct?.description || ""}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#F47B20]"
                  placeholder="Detalles de instalación, dimensiones, características..."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    name="isFeatured"
                    type="checkbox"
                    defaultChecked={editingProduct?.isFeatured || false}
                    className="rounded border-zinc-700 text-[#F47B20] focus:ring-[#F47B20]"
                  />
                  Producto Destacado
                </label>
                <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                  <input
                    name="isNew"
                    type="checkbox"
                    defaultChecked={editingProduct?.isNew || false}
                    className="rounded border-zinc-700 text-[#F47B20] focus:ring-[#F47B20]"
                  />
                  Marcar como Nuevo
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#F47B20] hover:bg-[#F47B20]/90 text-white text-sm font-medium"
                >
                  {editingProduct ? "Actualizar Producto" : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmación Eliminar Producto */}
      {deleteProductConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-rose-900/60 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6" strokeWidth={1.75} />
              <h3 className="font-bold text-lg text-white">¿Eliminar Producto?</h3>
            </div>
            <p className="text-sm text-zinc-400">
              Esta acción quitará el producto del catálogo y no se podrá recuperar.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setDeleteProductConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteProductConfirmId)}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Detalle de Orden */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#F47B20]" strokeWidth={1.75} />
                  Detalle de {orderDetailModal.orderNumber}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">Fecha: {orderDetailModal.createdAt}</p>
              </div>
              <button
                onClick={() => setOrderDetailModal(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {/* Datos del Cliente y Envío */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 text-xs">
              <div className="space-y-1">
                <span className="text-zinc-500 uppercase font-semibold">Cliente</span>
                <p className="text-zinc-200 font-medium text-sm">{orderDetailModal.customer.name}</p>
                <p className="text-zinc-400">{orderDetailModal.customer.email}</p>
                <p className="text-zinc-400">{orderDetailModal.customer.phone}</p>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 uppercase font-semibold">Dirección de Entrega</span>
                <p className="text-zinc-200 font-medium">{orderDetailModal.shippingAddress.address}</p>
                <p className="text-zinc-400">
                  {orderDetailModal.shippingAddress.city}, {orderDetailModal.shippingAddress.state}
                </p>
                <p className="text-zinc-400 font-mono">CP: {orderDetailModal.shippingAddress.zipCode}</p>
              </div>
            </div>

            {/* Lista de Items */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-semibold text-zinc-400">Materiales en la Orden</h4>
              <div className="border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800">
                {orderDetailModal.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 rounded-lg object-cover border border-zinc-700"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-zinc-400 font-mono">
                          {item.quantity} un. x $ {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white text-sm">
                      $ {item.total.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totales */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 space-y-2 text-sm font-mono">
              <div className="flex justify-between text-zinc-400 text-xs">
                <span>Subtotal Materiales:</span>
                <span>$ {orderDetailModal.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-xs">
                <span>Costo de Envío:</span>
                <span>$ {orderDetailModal.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-zinc-800 pt-2">
                <span>Total a Pagar:</span>
                <span className="text-[#F47B20]">$ {orderDetailModal.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setOrderDetailModal(null)}
                className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium"
              >
                Cerrar Detalle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
