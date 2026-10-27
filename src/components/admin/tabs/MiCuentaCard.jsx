import { useState } from "react";
import { KeyRound, Mail } from "lucide-react";
import authService from "@/services/auth.service";

const inputClase =
  "h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring";

function mensajeDeError(err, porDefecto) {
  return err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || porDefecto;
}

/**
 * "Mi cuenta": el administrador cambia su propia contraseña y su correo de acceso.
 * Ambos cambios piden la contraseña actual.
 */
export function MiCuentaCard({ emailActual }) {
  const [pwActual, setPwActual] = useState("");
  const [pwNueva, setPwNueva] = useState("");
  const [pwConfirma, setPwConfirma] = useState("");
  const [pwEstado, setPwEstado] = useState(null); // { tipo: "ok" | "error", texto }
  const [guardandoPw, setGuardandoPw] = useState(false);

  const [emailNuevo, setEmailNuevo] = useState("");
  const [pwParaEmail, setPwParaEmail] = useState("");
  const [emailEstado, setEmailEstado] = useState(null);
  const [guardandoEmail, setGuardandoEmail] = useState(false);

  const guardarPassword = async (e) => {
    e.preventDefault();
    setPwEstado(null);
    if (pwNueva.length < 10 || !/[A-Za-z]/.test(pwNueva) || !/\d/.test(pwNueva)) {
      setPwEstado({ tipo: "error", texto: "La contraseña nueva debe tener al menos 10 caracteres, con letras y números." });
      return;
    }
    if (pwNueva !== pwConfirma) {
      setPwEstado({ tipo: "error", texto: "La confirmación no coincide con la contraseña nueva." });
      return;
    }
    try {
      setGuardandoPw(true);
      await authService.changePassword(pwActual, pwNueva);
      setPwEstado({ tipo: "ok", texto: "Contraseña actualizada. Úsala la próxima vez que inicies sesión." });
      setPwActual("");
      setPwNueva("");
      setPwConfirma("");
    } catch (err) {
      setPwEstado({ tipo: "error", texto: mensajeDeError(err, "No se pudo cambiar la contraseña.") });
    } finally {
      setGuardandoPw(false);
    }
  };

  const guardarEmail = async (e) => {
    e.preventDefault();
    setEmailEstado(null);
    try {
      setGuardandoEmail(true);
      const res = await authService.changeEmail(pwParaEmail, emailNuevo.trim());
      setEmailEstado({ tipo: "ok", texto: `Correo actualizado a ${res?.data?.email || emailNuevo.trim()}. Úsalo para iniciar sesión.` });
      setEmailNuevo("");
      setPwParaEmail("");
    } catch (err) {
      setEmailEstado({ tipo: "error", texto: mensajeDeError(err, "No se pudo cambiar el correo.") });
    } finally {
      setGuardandoEmail(false);
    }
  };

  const aviso = (estado) =>
    estado && (
      <div
        role={estado.tipo === "error" ? "alert" : "status"}
        className={`rounded-lg border p-2 text-xs ${
          estado.tipo === "ok"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-rose-500/30 bg-rose-500/10 text-rose-400"
        }`}
      >
        {estado.texto}
      </div>
    );

  const boton =
    "inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 disabled:opacity-50 transition-colors";

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-xs space-y-6">
      <div className="border-b border-border pb-3">
        <h3 className="text-sm font-semibold text-foreground">Mi cuenta de administrador</h3>
        <p className="text-xs text-muted-foreground">
          Cambia tu contraseña y el correo con el que inicias sesión{emailActual ? ` (ahora: ${emailActual})` : ""}.
        </p>
      </div>

      <form onSubmit={guardarPassword} autoComplete="off" className="space-y-3">
        <h4 className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <KeyRound className="size-4" /> Cambiar contraseña
        </h4>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="mc-pw-actual" className="mb-1 block text-xs font-medium text-foreground">Contraseña actual</label>
            <input id="mc-pw-actual" type="password" required autoComplete="current-password" value={pwActual} onChange={(e) => setPwActual(e.target.value)} className={inputClase} />
          </div>
          <div>
            <label htmlFor="mc-pw-nueva" className="mb-1 block text-xs font-medium text-foreground">Contraseña nueva</label>
            <input id="mc-pw-nueva" type="password" required autoComplete="new-password" value={pwNueva} onChange={(e) => setPwNueva(e.target.value)} className={inputClase} />
          </div>
          <div>
            <label htmlFor="mc-pw-confirma" className="mb-1 block text-xs font-medium text-foreground">Repite la nueva</label>
            <input id="mc-pw-confirma" type="password" required autoComplete="new-password" value={pwConfirma} onChange={(e) => setPwConfirma(e.target.value)} className={inputClase} />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">Mínimo 10 caracteres, con letras y números.</p>
        {aviso(pwEstado)}
        <button type="submit" disabled={guardandoPw} className={boton}>
          {guardandoPw ? "Guardando…" : "Guardar contraseña"}
        </button>
      </form>

      <form onSubmit={guardarEmail} autoComplete="off" className="space-y-3 border-t border-border pt-5">
        <h4 className="flex items-center gap-2 text-xs font-semibold text-foreground">
          <Mail className="size-4" /> Cambiar correo de acceso
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="mc-email" className="mb-1 block text-xs font-medium text-foreground">Correo nuevo</label>
            <input id="mc-email" type="email" required autoComplete="off" value={emailNuevo} onChange={(e) => setEmailNuevo(e.target.value)} className={inputClase} />
          </div>
          <div>
            <label htmlFor="mc-email-pw" className="mb-1 block text-xs font-medium text-foreground">Contraseña actual</label>
            <input id="mc-email-pw" type="password" required autoComplete="current-password" value={pwParaEmail} onChange={(e) => setPwParaEmail(e.target.value)} className={inputClase} />
          </div>
        </div>
        {aviso(emailEstado)}
        <button type="submit" disabled={guardandoEmail} className={boton}>
          {guardandoEmail ? "Guardando…" : "Guardar correo"}
        </button>
      </form>
    </div>
  );
}
