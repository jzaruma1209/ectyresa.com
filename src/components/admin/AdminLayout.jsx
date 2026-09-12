import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./AdminSidebar";
import adminService from "@/services/admin.service";

// Importación de componentes de cada módulo
import { DashboardTab } from "./tabs/DashboardTab";
import { ProductsTab } from "./tabs/ProductsTab";
import { OrdersTab } from "./tabs/OrdersTab";
import { PaymentsTab } from "./tabs/PaymentsTab";
import { UsersTab } from "./tabs/UsersTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { InventoryLevelsTab } from "./tabs/InventoryLevelsTab";
import { MediaTab } from "./tabs/MediaTab";

// Importación de Modales
import { ProductModal } from "./modals/ProductModal";
import { OrderDetailModal } from "./modals/OrderDetailModal";
import { DeleteWarningModal } from "./modals/DeleteWarningModal";

const TAB_URL_MAP = {
  dashboard: "dashboard",
  inventario: "products",
  inventory: "products",
  productos: "products",
  products: "products",
  "niveles-inventario": "inventory-levels",
  "inventory-levels": "inventory-levels",
  "inventario-niveles": "inventory-levels",
  niveles: "inventory-levels",
  media: "media",
  medios: "media",
  imagenes: "media",
  // Categorías, marcas, modelos y medidas ahora viven en Niveles de Inventario
  medidas: "inventory-levels",
  catalogos: "inventory-levels",
  categorias: "inventory-levels",
  categories: "inventory-levels",
  marcas: "inventory-levels",
  brands: "inventory-levels",
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

  // Contador de órdenes pendientes en tiempo real para el badge del sidebar
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => {
        const payload = res?.data ?? res;
        const porEstado = payload?.pedidos?.porEstado ?? [];
        const pendientes = Number(
          porEstado.find((e) => e.estado === "PENDIENTE")?.total ?? 0
        );
        setPendingOrdersCount(pendientes);
      })
      .catch(() => {
        // En caso de que no haya conexión inicial
      });
  }, [currentTab]);

  // Estados de Modales Globales
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [refreshProductsTrigger, setRefreshProductsTrigger] = useState(0);

  const [selectedOrderIdForDetail, setSelectedOrderIdForDetail] = useState(null);

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

  // Desactivar producto (borrado lógico: deja de mostrarse en la tienda)
  const handleDeleteProduct = (producto) => {
    const id = producto.idProducto;

    setDeleteDialog({
      isOpen: true,
      title: "Desactivar Producto",
      message: `¿Estás seguro de que deseas desactivar "${producto.nombre}" (#${id})?`,
      warningText: "El producto dejará de mostrarse en la tienda. Podrás volver a activarlo desde Inventario.",
      confirmText: "Desactivar Producto",
      onConfirm: async () => {
        try {
          await adminService.desactivarProducto(id);
          showToast("Producto desactivado");
          setRefreshProductsTrigger((prev) => prev + 1);
        } catch (err) {
          alert("Error al desactivar el producto: " + (err.response?.data?.message || err.message));
        } finally {
          setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const tabTitles = {
    dashboard: "Dashboard",
    products: "Inventario",
    "inventory-levels": "Niveles de Inventario",
    media: "Media",
    orders: "Órdenes y Pedidos",
    payments: "Pagos y Liquidaciones",
    users: "Clientes y Cuentas",
    settings: "Configuración",
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans antialiased">
      <SidebarProvider>
        <AdminSidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          pendingOrdersCount={pendingOrdersCount}
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
                <span className="font-medium text-foreground">
                  {tabTitles[currentTab] || "Módulo"}
                </span>
              </div>
            </div>

            {toastMsg && (
              <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary animate-in fade-in slide-in-from-top-2">
                {toastMsg}
              </div>
            )}
          </header>

          {/* Contenido Dinámico de la Pestaña Activa conectado a la API */}
          <main className="flex-1 p-6">
            {currentTab === "dashboard" && (
              <DashboardTab onNavigateTab={handleSelectTab} />
            )}

            {currentTab === "products" && (
              <ProductsTab
                onOpenNewProductModal={() => {
                  setProductToEdit(null);
                  setProductModalOpen(true);
                }}
                onOpenEditProductModal={(producto) => {
                  setProductToEdit(producto);
                  setProductModalOpen(true);
                }}
                onDeleteProduct={handleDeleteProduct}
                refreshTrigger={refreshProductsTrigger}
              />
            )}

            {currentTab === "inventory-levels" && (
              <InventoryLevelsTab />
            )}

            {currentTab === "media" && (
              <MediaTab />
            )}

            {currentTab === "orders" && (
              <OrdersTab
                onOpenOrderDetailModal={(orderId) => setSelectedOrderIdForDetail(orderId)}
              />
            )}

            {currentTab === "payments" && (
              <PaymentsTab
                payments={[]}
                paymentStatusFilter="all"
                onPaymentStatusFilterChange={() => {}}
              />
            )}

            {currentTab === "users" && <UsersTab />}

            {currentTab === "settings" && (
              <SettingsTab
                settings={{
                  storeName: "ECTYRE Llantas & Servicios",
                  currency: "USD ($)",
                  taxRate: 15,
                  minFreeShipping: 100,
                  supportEmail: "soporte@ectyre.com",
                  phone: "+593 99 999 9999",
                }}
                onSaveSettings={() => showToast("Configuración guardada")}
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
          onSaved={() => {
            showToast(
              productToEdit
                ? "Producto actualizado correctamente"
                : "Nuevo producto registrado con éxito"
            );
            setRefreshProductsTrigger((prev) => prev + 1);
          }}
          productToEdit={productToEdit}
        />

        <OrderDetailModal
          orderId={selectedOrderIdForDetail}
          onClose={() => setSelectedOrderIdForDetail(null)}
        />

        <DeleteWarningModal
          isOpen={deleteDialog.isOpen}
          title={deleteDialog.title}
          message={deleteDialog.message}
          warningText={deleteDialog.warningText}
          confirmText={deleteDialog.confirmText}
          onConfirm={deleteDialog.onConfirm}
          onClose={() => setDeleteDialog((prev) => ({ ...prev, isOpen: false }))}
        />
      </SidebarProvider>
    </div>
  );
}
