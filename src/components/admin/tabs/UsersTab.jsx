import { Users, Shield, UserCheck, UserX } from "lucide-react";

export function UsersTab({
  users,
  userRoleFilter,
  onUserRoleFilterChange,
}) {
  const filteredUsers = users.filter((u) => {
    return userRoleFilter === "all" || u.role === userRoleFilter;
  });

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Usuarios y Clientes</h2>
          <p className="text-xs text-muted-foreground">Control de roles, cuentas y métricas de clientes</p>
        </div>

        <select
          value={userRoleFilter}
          onChange={(e) => onUserRoleFilterChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">Todos los roles</option>
          <option value="ADMIN">Administradores</option>
          <option value="MODERATOR">Moderadores</option>
          <option value="CUSTOMER">Clientes</option>
        </select>
      </div>

      {/* ── Tabla de Usuarios ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Pedidos Realizados</th>
                <th className="px-4 py-3">Gasto Total</th>
                <th className="px-4 py-3 text-right">Fecha Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-muted-foreground">
                    No hay usuarios que coincidan con los filtros.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                          {user.name.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                            : user.role === "MODERATOR"
                            ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          user.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-zinc-500/15 text-zinc-400 border-zinc-500/30"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-foreground">
                      {user.ordersCount} órdenes
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-foreground">
                      ${user.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-muted-foreground font-mono">
                      {user.createdAt}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
