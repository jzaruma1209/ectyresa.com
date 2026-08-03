import { useEffect, useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/auth.slice';
import adminService from '../../services/admin.service';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import './AdminLayout.css';

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pedidosPendientes, setPedidosPendientes] = useState(0);

  // Polling de pedidos pendientes cada 60 segundos
  useEffect(() => {
    const fetchPendientes = async () => {
      try {
        const res = await adminService.getDashboard();
        const payload = res?.data ?? res;
        const porEstado = payload?.pedidos?.porEstado ?? [];
        const pendienteEntry = porEstado.find((e) => e.estado === 'PENDIENTE');
        setPedidosPendientes(pendienteEntry ? Number(pendienteEntry.total) : 0);
      } catch {
        // silencioso
      }
    };

    fetchPendientes();
    const interval = setInterval(fetchPendientes, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    // admin-panel aplica las CSS vars de Ectyre al sidebar shadcn
    <div className="admin-panel">
      <SidebarProvider>
        <AppSidebar pedidosPendientes={pedidosPendientes} />

        <SidebarInset>
          {/* ── Header ── */}
          <header className="admin-header">
            <div className="admin-header__left">
              <SidebarTrigger className="admin-header__trigger" />
            </div>
            <div className="admin-header__right">
              {pedidosPendientes > 0 && (
                <NavLink to="/admin/pedidos" className="admin-header__alert">
                  🔔 {pedidosPendientes} pedido{pedidosPendientes !== 1 ? 's' : ''} pendiente{pedidosPendientes !== 1 ? 's' : ''}
                </NavLink>
              )}
            </div>
          </header>

          {/* ── Contenido ── */}
          <div className="admin-content">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
