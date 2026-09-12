import { useSelector } from "react-redux";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Disc,
  ShoppingCart,
  CreditCard,
  Users,
  Settings,
  ChevronsUpDown,
  Car,
  Boxes,
  Image as ImageIcon,
} from "lucide-react";

export function AdminSidebar({ currentTab, onSelectTab, pendingOrdersCount = 0, ...props }) {
  // Usuario autenticado desde Redux
  const authUser = useSelector((state) => state.auth?.user);
  const displayName = authUser?.nombre || authUser?.name || "ECTYRE Admin";
  const displayEmail = authUser?.email || "admin@ectyre.com";

  // Iniciales para el avatar corporativo
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "EC";

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "products", label: "Inventario", icon: Disc },
    { id: "inventory-levels", label: "Niveles de Inventario", icon: Boxes },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "orders", label: "Órdenes y Pedidos", icon: ShoppingCart, badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { id: "payments", label: "Liquidaciones", icon: CreditCard },
    { id: "users", label: "Clientes Registrados", icon: Users },
    { id: "settings", label: "Configuración", icon: Settings },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* ── Header: Marca Automotriz ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Car className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-sidebar-foreground">ECTYRE</span>
                <span className="truncate text-xs text-muted-foreground">Llantas & Servicios</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Contenido de Navegación ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración Automotriz</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      isActive={isActive}
                      onClick={() => onSelectTab(item.id)}
                      className="cursor-pointer"
                    >
                      <Icon className="size-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <SidebarMenuBadge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer: Perfil de Administrador ── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                {initials}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-sidebar-foreground">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{displayEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
