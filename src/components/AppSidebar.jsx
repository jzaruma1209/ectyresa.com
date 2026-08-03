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

/* ─────────────────────────────────────────────
   Íconos SVG — Lucide-style, stroke-only
───────────────────────────────────────────── */
const Ico = ({ d, children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const IcoDashboard  = () => <Ico><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Ico>;
const IcoPedidos    = () => <Ico><path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></Ico>;
const IcoClientes   = () => <Ico><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Ico>;
const IcoProductos  = () => <Ico><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></Ico>;
const IcoInventario = () => <Ico><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></Ico>;
const IcoCatalogos  = () => <Ico><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Ico>;
const IcoReportes   = () => <Ico><polyline points="22 12 18 8 14 12"/><line x1="18" y1="20" x2="18" y2="8"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></Ico>;
const IcoLogout     = () => <Ico><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Ico>;
const IcoChevronUp  = () => <Ico><polyline points="18 15 12 9 6 15"/></Ico>;

const NAV_ITEMS = [
  { to: '/admin/dashboard',  Icon: IcoDashboard,  label: 'Dashboard'  },
  { to: '/admin/pedidos',    Icon: IcoPedidos,    label: 'Pedidos'    },
  { to: '/admin/clientes',   Icon: IcoClientes,   label: 'Clientes'   },
  { to: '/admin/productos',  Icon: IcoProductos,  label: 'Productos'  },
  { to: '/admin/inventario', Icon: IcoInventario, label: 'Inventario' },
  { to: '/admin/catalogos',  Icon: IcoCatalogos,  label: 'Catálogos'  },
  { to: '/admin/reportes',   Icon: IcoReportes,   label: 'Reportes'   },
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
          <div style={{
            width: 30, height: 30, minWidth: 30, borderRadius: '50%',
            background: '#E60000', color: '#fff',
            fontSize: '0.8rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, margin: '0 auto'
          }}>
            {user?.nombre?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3, overflow: 'hidden' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--sidebar-foreground)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.nombre || 'Administrador'}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'color-mix(in oklch, var(--sidebar-foreground) 60%, transparent)' }}>
              Admin
            </span>
          </div>
          <IcoChevronUp />
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
              background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '8px', zIndex: 50,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              {/* Info de usuario */}
              <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 6 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                  {user?.nombre || 'Administrador'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#808080' }}>
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
                  color: '#CCCCCC', fontSize: '0.82rem', fontWeight: 500,
                  transition: 'background 150ms, color 150ms',
                  textAlign: 'left',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,0,0,0.15)'; e.currentTarget.style.color = '#E60000'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#CCCCCC'; }}
              >
                <IcoLogout />
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
                <div style={{
                  width: 30, height: 30, minWidth: 30, borderRadius: 8,
                  background: '#E60000', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1.1rem', flexShrink: 0,
                  fontFamily: 'inherit', margin: '0 auto'
                }}>
                  E
                </div>
                {/* Texto — oculto al colapsar */}
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.3 }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--sidebar-foreground)' }}>
                    Ectyre
                  </span>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.07em', color: '#E60000',
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
                        <Icon />
                        <span>{label}</span>
                        {/* Badge pedidos pendientes */}
                        {label === 'Pedidos' && pedidosPendientes > 0 && (
                          <SidebarMenuBadge style={{ background: '#E60000', color: '#fff' }}>
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
