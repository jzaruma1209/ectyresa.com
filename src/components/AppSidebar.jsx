import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/auth.slice';
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
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Package,
  Boxes,
  FolderTree,
  BarChart3,
  LogOut,
  ChevronUp,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Navegación admin — 7 secciones fijas.
   Iconos lucide-react con strokeWidth 1.75.
───────────────────────────────────────────── */
const NAV_ITEMS = [
  { to: '/admin/dashboard',  Icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/admin/pedidos',    Icon: ShoppingCart,    label: 'Pedidos'    },
  { to: '/admin/clientes',   Icon: Users,           label: 'Clientes'   },
  { to: '/admin/productos',  Icon: Package,         label: 'Productos'  },
  { to: '/admin/inventario', Icon: Boxes,           label: 'Inventario' },
  { to: '/admin/catalogos',  Icon: FolderTree,      label: 'Catálogos'  },
  { to: '/admin/reportes',   Icon: BarChart3,       label: 'Reportes'   },
];

/* ─────────────────────────────────────────────
   User footer popup (sin DropdownMenu)
───────────────────────────────────────────── */
function UserFooter({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="relative"
          onClick={() => setOpen((v) => !v)}
        >
          {/* Avatar */}
          <img
            src="/1.png"
            alt={user?.nombre || 'Administrador'}
            style={{
              width: 30, height: 30, minWidth: 30, borderRadius: '50%',
              objectFit: 'cover', flexShrink: 0, margin: '0 auto',
              background: '#fff',
            }}
          />
          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, overflow: 'hidden' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--sidebar-foreground)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.nombre || 'Administrador'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'color-mix(in oklch, var(--sidebar-foreground) 60%, transparent)' }}>
              Admin
            </span>
          </div>
          <ChevronUp size={16} strokeWidth={1.75} />
        </SidebarMenuButton>

        {/* Popup de logout */}
        {open && (
          <>
            {/* Overlay para cerrar */}
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 49 }}
              onClick={() => setOpen(false)}
            />
            {/* Menú */}
            <div style={{
              position: 'absolute', bottom: 'calc(100% + 8px)', left: 8, right: 8,
              background: '#18181b', border: '1px solid #27272a',
              borderRadius: 10, padding: '8px', zIndex: 50,
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            }}>
              {/* Info de usuario */}
              <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid #27272a', marginBottom: 6 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#FFFFFF' }}>
                  {user?.nombre || 'Administrador'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#A1A1AA' }}>
                  {user?.email || 'admin@ectyre.com'}
                </div>
              </div>
              {/* Cerrar sesión */}
              <button
                onClick={() => { setOpen(false); onLogout(); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 7,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#A1A1AA', fontSize: '0.82rem', fontWeight: 500,
                  transition: 'background 150ms, color 150ms',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#27272a'; e.currentTarget.style.color = '#fafafa'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#A1A1AA'; }}
              >
                <LogOut size={16} strokeWidth={1.75} />
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/* ─────────────────────────────────────────────
   AppSidebar — usa el <Sidebar> real de shadcn
───────────────────────────────────────────── */
export function AppSidebar({ pedidosPendientes = 0, ...props }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  return (
    <Sidebar collapsible="icon" {...props}>

      {/* ── HEADER — Logo Ectyre ADMIN ── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent cursor-default">
              <div>
                {/* Logo icon — visible siempre */}
                <img
                  src="/2.png"
                  alt="Ectyre"
                  style={{
                    width: 30, height: 30, minWidth: 30, borderRadius: 8,
                    objectFit: 'contain', flexShrink: 0, margin: '0 auto',
                  }}
                />
                {/* Texto — oculto al colapsar */}
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF' }}>
                    Ectyre
                  </span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: '#71717a',
                  }}>
                    Admin Panel
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── CONTENT — Navegación ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ to, Icon, label }) => (
                <SidebarMenuItem key={to}>
                  <NavLink to={to} style={{ display: 'contents' }}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild={false}
                        isActive={isActive}
                        tooltip={label}
                        onClick={() => navigate(to)}
                      >
                        <Icon size={16} strokeWidth={1.75} />
                        <span>{label}</span>
                        {/* Badge pedidos pendientes */}
                        {label === 'Pedidos' && pedidosPendientes > 0 && (
                          <SidebarMenuBadge style={{ background: '#fafafa', color: '#18181b' }} className="font-mono">
                            {pedidosPendientes}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── FOOTER — Usuario con popup de logout ── */}
      <SidebarFooter>
        <UserFooter user={user} onLogout={handleLogout} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
