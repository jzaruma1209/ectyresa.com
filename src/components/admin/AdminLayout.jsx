import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./AdminSidebar";

// Importación de datos mock
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_ORDERS,
  INITIAL_PAYMENTS,
  INITIAL_USERS,
  INITIAL_SETTINGS,
} from "./mockData";

// Importación de componentes de cada módulo
import { DashboardTab } from "./tabs/DashboardTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { CategoriesTab } from "./tabs/CategoriesTab";
import { BrandsTab } from "./tabs/BrandsTab";
import { OrdersTab } from "./tabs/OrdersTab";
import { PaymentsTab } from "./tabs/PaymentsTab";
import { UsersTab } from "./tabs/UsersTab";
import { SettingsTab } from "./tabs/SettingsTab";

// Importación de Modales
import { ProductModal } from "./modals/ProductModal";
import { CategoryModal } from "./modals/CategoryModal";
import { BrandModal } from "./modals/BrandModal";
import { OrderDetailModal } from "./modals/OrderDetailModal";
import { DeleteWarningModal } from "./modals/DeleteWarningModal";

const TAB_URL_MAP = {
  dashboard: "dashboard",
  productos: "products",
  products: "products",
  categorias: "categories",
  categories: "categories",
  marcas: "brands",
  brands: "brands",
  ordenes: "orders",
  orders: "orders",
  pedidos: "orders",
  pagos: "payments",
  payments: "payments",
  usuarios: "users",
  users: "users",
  clientes: "users",
  configuracion: "settings",
  settings: "settings",
};

export default function AdminLayout() {
  const { tab } = useParams();
  const navigate = useNavigate();

  // Determinar pestaña activa sincronizada con la URL
  const initialTab = tab ? TAB_URL_MAP[tab.toLowerCase()] || "dashboard" : "dashboard";
  const [currentTab, setCurrentTab] = useState(initialTab);

  useEffect(() => {
    if (tab && TAB_URL_MAP[tab.toLowerCase()]) {
      setCurrentTab(TAB_URL_MAP[tab.toLowerCase()]);
    }
  }, [tab]);

  const handleSelectTab = (tabId) => {
    setCurrentTab(tabId);
    navigate(`/admin/${tabId}`);
  };

  // Estados de datos en memoria
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  // Filtros
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Estados de Modales
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);

  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);

  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    warningText: "",
    onConfirm: () => {},
  });

  // Notificación Toast flotante
  const [toastMsg, setToastMsg] = useState(null);
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Métricas calculadas para el dashboard
  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((acc, curr) => acc + curr.total, 0);
    const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    return {
      totalRevenue,
      totalOrdersCount: orders.length,
      pendingOrdersCount,
      totalUsersCount: users.length,
      totalProductsCount: products.length,
      lowStockCount,
    };
  }, [orders, products, users]);

  // Handlers para Productos
  const handleSaveProduct = (productData) => {
    if (productData.id) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? { ...p, ...productData } : p))
      );
      showToast("Producto actualizado exitosamente");
    } else {
      const newProd = {
        ...productData,
        id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProducts((prev) => [newProd, ...prev]);
      showToast("Nuevo producto creado con éxito");
    }
  };

  const handleDeleteProduct = (productId) => {
    setDeleteDialog({
      isOpen: true,
      title: "Eliminar Producto",
      message: "¿Estás seguro de que deseas eliminar este producto del catálogo?",
      warningText: "Esta acción no se puede deshacer.",
      onConfirm: () => {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
        showToast("Producto eliminado del catálogo");
      },
    });
  };

  // Handlers para Categorías
  const handleSaveCategory = (catData) => {
    if (catData.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === catData.id ? { ...c, ...catData } : c))
      );
      showToast("Categoría actualizada");
    } else {
      const newCat = {
        ...catData,
        id: `cat-${Date.now()}`,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast("Nueva categoría creada");
    }
  };

  const handleDeleteCategory = (cat) => {
    const warning =
      cat.productCount > 0
        ? `¡Atención! Hay ${cat.productCount} productos asociados a esta categoría. Eliminarla dejará dichos productos sin clasificación.`
        : "";

    setDeleteDialog({
      isOpen: true,
      title: `Eliminar Categoría: ${cat.name}`,
      message: "¿Deseas remover esta categoría permanentemente?",
      warningText: warning,
      onConfirm: () => {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        showToast("Categoría eliminada");
      },
    });
  };

  // Handlers para Marcas
  const handleSaveBrand = (brandData) => {
    if (brandData.id) {
      setBrands((prev) =>
        prev.map((b) => (b.id === brandData.id ? { ...b, ...brandData } : b))
      );
      showToast("Marca actualizada");
    } else {
      const newBrand = {
        ...brandData,
        id: `brand-${Date.now()}`,
      };
      setBrands((prev) => [...prev, newBrand]);
      showToast("Nueva marca registrada");
    }
  };

  const handleDeleteBrand = (brand) => {
    const warning =
      brand.productCount > 0
        ? `Advertencia: Esta marca tiene ${brand.productCount} productos registrados en tienda.`
        : "";

    setDeleteDialog({
      isOpen: true,
      title: `Eliminar Marca: ${brand.name}`,
      message: "¿Confirmas la eliminación de este proveedor?",
      warningText: warning,
      onConfirm: () => {
        setBrands((prev) => prev.filter((b) => b.id !== brand.id));
        showToast("Marca eliminada");
      },
    });
  };

  // Handlers para Órdenes
  const handleChangeOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Estado de la orden actualizado a ${newStatus}`);
  };

  // Handlers para Configuración
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    showToast("Parámetros globales guardados correctamente");
  };

  const tabTitles = {
    dashboard: "Dashboard",
    products: "Productos",
    categories: "Categorías",
    brands: "Marcas",
    orders: "Órdenes y Despacho",
    payments: "Pagos y Liquidaciones",
    users: "Usuarios y Clientes",
    settings: "Configuración",
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans antialiased">
      <SidebarProvider>
        {/* Sidebar shadcn con los 8 módulos */}
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          pendingOrdersCount={stats.pendingOrdersCount}
        />

        <SidebarInset className="bg-background">
          {/* Header Superior */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1 text-foreground hover:bg-muted" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">ECTYRE Admin</span>
                <span>/</span>
                <span className="font-medium text-foreground">{tabTitles[currentTab] || "Módulo"}</span>
              </div>
            </div>

            {toastMsg && (
              <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary animate-in fade-in slide-in-from-top-2">
                {toastMsg}
              </div>
            )}
          </header>

          {/* Contenido Dinámico de la Pestaña Activa */}
          <main className="flex-1 p-6">
            {currentTab === "dashboard" && (
              <DashboardTab
                stats={stats}
                orders={orders}
                onNavigateTab={handleSelectTab}
              />
            )}

            {currentTab === "products" && (
              <ProductsTab
                products={products}
                categories={categories}
                searchQuery={productSearch}
                onSearchChange={setProductSearch}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                onOpenNewProductModal={() => {
                  setProductToEdit(null);
                  setProductModalOpen(true);
                }}
                onOpenEditProductModal={(prod) => {
                  setProductToEdit(prod);
                  setProductModalOpen(true);
                }}
                onDeleteProduct={handleDeleteProduct}
              />
            )}

            {currentTab === "categories" && (
              <CategoriesTab
                categories={categories}
                onOpenNewCategoryModal={() => {
                  setCategoryToEdit(null);
                  setCategoryModalOpen(true);
                }}
                onOpenEditCategoryModal={(cat) => {
                  setCategoryToEdit(cat);
                  setCategoryModalOpen(true);
                }}
                onDeleteCategory={handleDeleteCategory}
              />
            )}

            {currentTab === "brands" && (
              <BrandsTab
                brands={brands}
                onOpenNewBrandModal={() => {
                  setBrandToEdit(null);
                  setBrandModalOpen(true);
                }}
                onOpenEditBrandModal={(brand) => {
                  setBrandToEdit(brand);
                  setBrandModalOpen(true);
                }}
                onDeleteBrand={handleDeleteBrand}
              />
            )}

            {currentTab === "orders" && (
              <OrdersTab
                orders={orders}
                orderSearchQuery={orderSearch}
                onOrderSearchChange={setOrderSearch}
                orderStatusFilter={orderStatusFilter}
                onOrderStatusFilterChange={setOrderStatusFilter}
                onChangeOrderStatus={handleChangeOrderStatus}
                onOpenOrderDetailModal={setSelectedOrderForDetail}
              />
            )}

            {currentTab === "payments" && (
              <PaymentsTab
                payments={payments}
                paymentStatusFilter={paymentStatusFilter}
                onPaymentStatusFilterChange={setPaymentStatusFilter}
              />
            )}

            {currentTab === "users" && (
              <UsersTab
                users={users}
                userRoleFilter={userRoleFilter}
                onUserRoleFilterChange={setUserRoleFilter}
              />
            )}

            {currentTab === "settings" && (
              <SettingsTab
                settings={settings}
                onSaveSettings={handleSaveSettings}
              />
            )}
          </main>
        </SidebarInset>

        {/* Modales Compartidos */}
        <ProductModal
          isOpen={productModalOpen}
          onClose={() => {
            setProductModalOpen(false);
            setProductToEdit(null);
          }}
          onSave={handleSaveProduct}
          productToEdit={productToEdit}
          categories={categories}
          brands={brands}
        />

        <CategoryModal
          isOpen={categoryModalOpen}
          onClose={() => {
            setCategoryModalOpen(false);
            setCategoryToEdit(null);
          }}
          onSave={handleSaveCategory}
          categoryToEdit={categoryToEdit}
        />

        <BrandModal
          isOpen={brandModalOpen}
          onClose={() => {
            setBrandModalOpen(false);
            setBrandToEdit(null);
          }}
          onSave={handleSaveBrand}
          brandToEdit={brandToEdit}
        />

        <OrderDetailModal
          order={selectedOrderForDetail}
          onClose={() => setSelectedOrderForDetail(null)}
        />

        <DeleteWarningModal
          isOpen={deleteDialog.isOpen}
          title={deleteDialog.title}
          message={deleteDialog.message}
          warningText={deleteDialog.warningText}
          onConfirm={deleteDialog.onConfirm}
          onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        />
      </SidebarProvider>
    </div>
  );
}
