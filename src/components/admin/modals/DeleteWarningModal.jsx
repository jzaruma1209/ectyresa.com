import { AlertTriangle, Trash2, X } from "lucide-react";

export function DeleteWarningModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  warningText,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertTriangle className="size-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-foreground">{title || "Confirmar eliminación"}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{message}</p>
            {warningText && (
              <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400">
                {warningText}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-input bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-4 py-2 text-xs font-medium text-destructive-foreground shadow-xs hover:bg-destructive/90 transition-colors"
          >
            <Trash2 className="size-3.5" />
            Eliminar Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
}
