---
name: import-external-component
description: Instrucciones paso a paso y la mentalidad correcta para importar, optimizar y adaptar componentes UI externos (especialmente ReactBits) al ecosistema de Ectyre.
---

# Importación y Optimización de Componentes Externos (ReactBits)

Esta skill se activa cuando el usuario solicita implementar o importar un componente de un sitio web de fragmentos de UI (como `reactbits.dev`, `ui.shadcn.com`, etc.) mediante un enlace o código proporcionado.

## 🧠 La Mentalidad Correcta (Especial para ReactBits)

Siempre recuerda este principio fundacional:
**ReactBits ≠ librería instalable**
**ReactBits = código reutilizable (snippets avanzados de UI)**

Por lo tanto:
* No existe `npm install reactbits`.
* Se copia el código fuente completo.
* Se adapta al proyecto y se convierte en un componente reutilizable.

---

## 🛠 Flujo Universal / Algoritmo de Integración

Sigue estrictamente este patrón mental y flujo de ejecución cada vez que integres un componente:

### 1) Copiar y Crear el Componente
- Copia el bloque completo del componente (JSX, Hooks, Animaciones, Estilos). **Nunca copies solo partes.**
- Crea el nuevo archivo en la carpeta correspondiente. Ejemplo: `src/components/ui/NombreDelComponente.jsx`.
- Pega el código dentro del archivo.

### 2) Revisar e Instalar Dependencias
- Revisa los imports al inicio del archivo (ej. `import { motion } from "framer-motion";`).
- Las dependencias más comunes son `framer-motion` y librerías de iconos.
- Si falta alguna dependencia en el proyecto (verifica el `package.json`), infórmale al usuario para instalarla, u ofrécete a ejecutar el comando de instalación (ej. `npm install framer-motion`).

### 3) Limpiar Código Demo y Hacerlo Reutilizable
- Elimina textos ficticios, arrays hardcodeados o imágenes de placeholder incluidos en el snippet de demostración.
- **Transforma los datos en props** (ej. `<Componente items={data} />`).
- **Nunca** dejes datos hardcodeados dentro del componente. Esto lo hace reutilizable, escalable y desacoplado.

### 4) Adaptación de Diseño (Regla Ectyre 60-30-10)
Al transcribir o modificar el CSS/Tailwind, ignora los colores de acento por defecto (ej. `?accentColor=xxxxxx` o `bg-blue-500`) y **aplica estrictamente la regla Ectyre**:
- **60% Dominante:** Fondos blancos (`#FFFFFF` o `bg-white`) o grises muy claros (`#F5F5F5` o `bg-gray-100/50`).
- **30% Secundario:** Textos e íconos en negro intenso (`#000000`, `text-black` o `text-gray-900`).
- **10% Acento:** Componentes clave o interacciones deben usar el **Rojo Ectyre** (`#E60000` o `bg-[#E60000]`, `text-[#E60000]`).

### 5) Optimización Técnica Obligatoria (Prevención de Bugs)
Los componentes externos suelen priorizar estética sobre rendimiento. Debes refactorizar el código para prevenir errores comunes:
- **Prevención de Re-renders Innecesarios:** Usa `React.memo` si aplica, y `useMemo`/`useCallback` para objetos/funciones que viajen como props o generen renders pesados.
- **Gestión Segura de Listeners (Scroll/Resize):** Todo `addEventListener` en un `useEffect` **DEBE** tener su correspondiente `removeEventListener` en la función de limpieza (cleanup). Si aplican, usa `throttle` o `debounce`.
- **Rendimiento de Animaciones (FPS):** Usa clases de aceleración por hardware en Tailwind (`will-change-transform`, `will-change-opacity`) para animaciones o transiciones pesadas.
- **Corrección de `useEffect`:** Los arrays de dependencias deben ser precisos; evita recrear lógica en efectos si se puede hacer en el render.

### 6) Conectar con la Lógica (Separación de Responsabilidades)
- **Componentes Importados = UI + Animación.**
- **Proyecto = Lógica Fuerte + Datos del Backend.**
- Nunca mezcles lógica de negocio compleja (ej. llamadas a la API) directamente dentro del snippet de UI. Pásala a través de props o hooks en el componente padre.

### 7) Entregable
- Exporta limpiamente el componente.
- Entrega un pequeño ejemplo en código de cómo se debe importar y utilizar el componente modificado en un archivo de la aplicación (pasándole los props correctos).
