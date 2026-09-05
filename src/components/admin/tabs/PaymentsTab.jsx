import { CreditCard, ArrowDownRight, CheckCircle2, Clock, XCircle, RefreshCw } from "lucide-react";

export function PaymentsTab({
  payments,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
}) {
  const statusConfig = {
    completed: { label: "Completado", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
    pending: { label: "En Espera", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: Clock },
    failed: { label: "Fallido", color: "bg-rose-500/15 text-rose-400 border-rose-500/30", icon: XCircle },
    refunded: { label: "Reembolsado", color: "bg-purple-500/15 text-purple-400 border-purple-500/30", icon: RefreshCw },
  };

  const filteredPayments = payments.filter((p) => {
    return paymentStatusFilter === "all" || p.status === paymentStatusFilter;
  });

  return (
    <div className="space-y-4">
      {/* ── Toolbar ── */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Pagos y Transacciones</h2>
          <p className="text-xs text-muted-foreground">Auditoría financiera y estado de liquidaciones</p>
        </div>

        <select
          value={paymentStatusFilter}
          onChange={(e) => onPaymentStatusFilterChange(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="all">Todos los estados</option>
          <option value="completed">Completados</option>
          <option value="pending">En Espera</option>
          <option value="failed">Fallidos</option>
          <option value="refunded">Reembolsados</option>
        </select>
      </div>

      {/* ── Tabla de Pagos ── */}
      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">ID Transacción</th>
                <th className="px-4 py-3">Orden Asociada</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-muted-foreground">
                    No hay transacciones que coincidan con el filtro.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => {
                  const status = statusConfig[payment.status] || statusConfig.completed;
                  return (
                    <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        {payment.id}
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">
                        {payment.orderId}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{payment.userName}</div>
                        <div className="text-xs text-muted-foreground">{payment.userEmail}</div>
                      </td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">
                        {payment.method === "card" ? "Tarjeta Débito/Crédito" : payment.method === "transfer" ? "Transferencia Bancaria" : payment.method}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-foreground">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.color}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground font-mono">
                        {payment.date}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
