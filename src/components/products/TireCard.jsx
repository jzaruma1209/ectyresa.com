import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * TireCard — Tarjeta de producto premium (rediseño visual).
 * La lógica de negocio se mantiene intacta: precio, PVP, IVA, cantidad
 * y redirección a WhatsApp. Solo cambia la presentación.
 */
const TireCard = ({
  product,         // Objeto principal de la tarjeta actual (Tire)
  sashSrc,         // Banner promocional top (Opcional)
  brandLogoSrc,    // Logo de la marca (Opcional)
  tireSrc,         // Foto específica (Opcional, hace fallback a product.image)
  terrainType,     // "AT", "MT", "LT" (Opcional)
  specs,           // { wet: 0, dry: 0, noise: "109S" } (Opcional)
  show247 = true,
  pvp,
}) => {
  const [qty, setQty] = useState(1);

  // ----------------------------------------------------
  // PLACEHOLDERS & REGULARIZACIÓN DE PROPS DESDE LA BD
  // ----------------------------------------------------
  const altImage = (product?.name?.length || 0) % 2 === 0 ? "/llanta1.png" : "/llanta2.png";
  const finalTireSrc = tireSrc || product?.image || altImage;

  // 2. Especificaciones de Terreno y Físicas
  const finalSpecs = specs || { wet: 0, dry: 0, noise: "109S" };
  const finalTerrain = terrainType || "AT";

  // 3. Extracción Segura de Precio
  const tempPrice = product?.finalPrice || product?.price || 0;
  // PVP fake (si no hay pvp mandado) -> Le suma un % referencial
  const originalPrice = pvp || product?.price || (tempPrice * 1.15);

  const formatPrice = (val) => {
    const safeVal = Number(val) || 0;
    const [int, dec] = safeVal.toFixed(2).split(".");
    return { int, dec };
  };
  const { int, dec } = formatPrice(tempPrice);

  const name = product?.name || "Producto sin nombre";

  // 4. Badges (máximo 2): terreno activo + descuento cuando aplica
  const hasDiscount =
    pvp && Number(originalPrice) > tempPrice && Number(originalPrice) > 0;
  const discountPct = hasDiscount
    ? Math.round(((Number(originalPrice) - tempPrice) / Number(originalPrice)) * 100)
    : 0;
  const badges = [
    finalTerrain,
    ...(hasDiscount ? [{ type: "discount", label: `${discountPct}%` }] : []),
  ];

  const terrainStyles = {
    AT: "bg-[#e8f0fe] text-[#1a3a8f] border-[#a8c0f0]",
    MT: "bg-[#fef3e2] text-[#7a4800] border-[#f0c87a]",
    LT: "bg-[#eaf3de] text-[#27500a] border-[#a0cc6a]",
  };

  const specItems = [
    {
      key: "wet",
      value: finalSpecs.wet,
      title: "Adherencia en mojado",
      iconBg: "bg-[#fde8e8]",
      icon: (
        <svg width="10" height="10" viewBox="0 0 16 16">
          <path d="M8 1 C5 4 2 6 2 10 a6 6 0 0 0 12 0 C14 6 11 4 8 1z" fill="#e83a2b" />
        </svg>
      ),
    },
    {
      key: "dry",
      value: finalSpecs.dry,
      title: "Rendimiento en seco",
      iconBg: "bg-[#f0f0f0]",
      icon: (
        <svg width="10" height="10" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="5" fill="none" stroke="#888" strokeWidth="2" />
          <path d="M8 4 v4 l3 2" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "noise",
      value: finalSpecs.noise,
      title: "Decibeles de ruido",
      iconBg: "bg-[#f0f0f0]",
      icon: (
        <svg width="10" height="10" viewBox="0 0 16 16">
          <path d="M2 10 Q5 4 8 8 Q11 12 14 6" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  // 5. Lógica de Redirección temporal a WhatsApp (sin cambios)
  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const phoneNumber = "593999601748";
    const message = `Hola, estoy interesado en el producto: ${name} y la cantidad: ${qty} por ahora.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((q) => Math.max(1, q - 1));
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQty((q) => q + 1);
  };

  return (
    <div className="tire-card flex w-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white font-sans shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* --- SASH BANDA PROMOCIONAL (solo cuando existe banner real) --- */}
      {sashSrc && (
        <img src={sashSrc} alt="Promoción" className="block h-9 w-full object-cover" loading="lazy" decoding="async" />
      )}

      {/* --- LOGO DE MARCA --- */}
      <div className="flex justify-center px-3 pb-1.5 pt-3">
        {brandLogoSrc ? (
          <img src={brandLogoSrc} alt="Marca" className="h-7 object-contain" loading="lazy" decoding="async" />
        ) : (
          <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">
            {product?.brand || "MARCA C.A."}
          </span>
        )}
      </div>

      {/* --- IMAGEN HERO + BADGES --- */}
      <Link
        to={`/product/${product?.id || "#"}`}
        className="group relative mx-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg bg-[#f7f8fa]"
        style={{ textDecoration: "none" }}
        title={`Ver detalles de ${name}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={finalTireSrc}
          alt={name}
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = '/llanta1.png'; }}
        />

        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {badges.slice(0, 2).map((badge, i) =>
            typeof badge === "string" ? (
              <span
                key={i}
                className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold leading-tight shadow-sm ${terrainStyles[badge] || terrainStyles.AT}`}
              >
                {badge}
              </span>
            ) : (
              <span
                key={i}
                className="rounded-md bg-[#e83a2b] px-1.5 py-0.5 text-[9px] font-bold leading-tight text-white shadow-sm"
              >
                -{badge.label}
              </span>
            )
          )}
        </div>
      </Link>

      {/* --- PRECIO --- */}
      <div className="flex items-center justify-between px-3 pt-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold leading-none text-[#e83a2b]">${int}</span>
            <sup className="text-[11px] font-bold text-[#e83a2b]">.{dec}</sup>
            <span className="ml-0.5 text-[10px] font-medium text-gray-400">+ IVA</span>
          </div>
          <span className="text-[10px] text-gray-400 line-through">
            PVP ${Number(originalPrice).toFixed(2)}
          </span>
        </div>
        {show247 && (
          <img
            src="/1.png"
            alt="Promoción"
            className="hidden h-7 w-7 shrink-0 rounded-full border border-black/10 object-cover shadow-sm min-[440px]:block"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* --- NOMBRE: siempre 2 líneas para uniformidad de altura --- */}
      <div className="px-3 pt-1.5">
        <p
          className="my-0 line-clamp-2 min-h-[2.75em] text-xs font-semibold leading-snug text-[#222]"
          title={name}
        >
          {name}
        </p>
      </div>

      {/* --- SPECS COMPACTAS --- */}
      <div className="flex items-center gap-3 px-3 pt-1.5">
        {specItems.map((spec) => (
          <div key={spec.key} className="flex items-center gap-1" title={spec.title}>
            <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${spec.iconBg}`}>
              {spec.icon}
            </span>
            <span className="text-[10px] font-semibold text-gray-500">{spec.value}</span>
          </div>
        ))}
      </div>

      {/* --- ACCIONES: botón alineado al fondo en todas las tarjetas --- */}
      <div className="mt-auto flex items-center gap-2 px-3 pb-2 pt-1.5">
        {/* Selector de cantidad compacto */}
        <div className="group flex h-8 w-[80px] shrink-0 items-center justify-between overflow-hidden rounded-[10px] border border-gray-200 bg-white transition-colors duration-200 hover:border-[#e83a2b] hover:bg-[#e83a2b]">
          <button
            data-slot="stepper-btn"
            className="flex h-full w-6 items-center justify-center border-none bg-transparent p-0 text-gray-400 transition-colors duration-200 group-hover:text-white"
            onClick={handleDecrement}
            aria-label="Disminuir cantidad"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
          </button>
          <span className="min-w-[20px] text-center text-xs font-bold text-[#1a1a1a] transition-colors duration-200 group-hover:text-white">{qty}</span>
          <button
            data-slot="stepper-btn"
            className="flex h-full w-6 items-center justify-center border-none bg-transparent p-0 text-gray-400 transition-colors duration-200 group-hover:text-white"
            onClick={handleIncrement}
            aria-label="Aumentar cantidad"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
        {/* Botón principal */}
        <button
          data-slot="action-btn"
          className="flex h-8 flex-1 items-center justify-center gap-1 rounded-[10px] border-none bg-[#e83a2b] p-0 text-xs font-bold text-white transition-colors hover:bg-[#d0281b] active:scale-[0.98] min-[440px]:text-[13px]"
          onClick={handleBuy}
        >
          <svg className="hidden min-[440px]:block" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Agregar
        </button>
      </div>
    </div>
  );
};

export default TireCard;
