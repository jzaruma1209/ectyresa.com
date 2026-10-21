import { useState } from "react";
import { Link } from "react-router-dom";

import { optimizeImage } from "../../utils/cloudinaryImage";
import { buildProductMessage, openWhatsApp } from "../../utils/whatsapp";

/**
 * TireCard — Tarjeta de producto premium (rediseño visual).
 * La lógica de negocio se mantiene intacta: precio, PVP, IVA, cantidad
 * y redirección a WhatsApp. Solo cambia la presentación.
 */
const TireCard = ({
  product,         // Objeto principal de la tarjeta actual (Tire)
  sashSrc,         // Banner promocional top (Opcional)
  brandLogoSrc,    // Logo de la marca (Opcional)
  brandBannerSrc,  // Banner de la marca (Opcional)
  tireSrc,         // Foto específica (Opcional, hace fallback a product.image)
  terrainType,     // "AT", "MT", "LT" (Opcional)
  specs,           // { wet: 0, dry: 0, noise: "109S" } (Opcional)
  show247 = true,
  pvp,
  compact = false, // Versión reducida (ej: carrusel de ofertas del hero)
}) => {
  const [qty, setQty] = useState(1);

  // Producto real de la API (contrato de /productos) vs. datos de ejemplo del home
  const fromApi = Boolean(product?.fromApi);
  const agotado = fromApi && product?.inStock === false;

  // ----------------------------------------------------
  // PLACEHOLDERS & REGULARIZACIÓN DE PROPS DESDE LA BD
  // ----------------------------------------------------
  const altImage = (product?.name?.length || 0) % 2 === 0 ? "/llanta1.webp" : "/llanta2.webp";
  // Anchos a ~2x del tamaño mostrado para pantallas de alta densidad.
  const finalTireSrc = optimizeImage(tireSrc || product?.image || altImage, 480);
  const finalBrandBanner = brandBannerSrc || product?.brandBanner || null;
  const finalBrandLogo = brandLogoSrc || product?.brandLogo || null;
  const finalBrandDisplay = optimizeImage(finalBrandBanner || finalBrandLogo, 300);
  const finalSash = optimizeImage(sashSrc ?? product?.sash ?? null, 600);

  // 2. Especificaciones de Terreno y Físicas
  const finalSpecs = specs || { wet: 0, dry: 0, noise: "109S" };
  // En productos reales el terreno viene del tipo de uso del modelo (se oculta si no tiene)
  const finalTerrain = terrainType || (fromApi ? product?.modelUse?.codigo || null : "AT");

  // 3. Extracción Segura de Precio
  const tempPrice = product?.finalPrice || product?.price || 0;
  // PVP fake (si no hay pvp mandado) -> Le suma un % referencial. En productos reales solo
  // se muestra el precio anterior cuando existe un descuento real.
  const originalPrice = fromApi
    ? (product?.discount > 0 ? product.price : null)
    : pvp || product?.price || (tempPrice * 1.15);

  const formatPrice = (val) => {
    const safeVal = Number(val) || 0;
    const [int, dec] = safeVal.toFixed(2).split(".");
    return { int, dec };
  };
  const { int, dec } = formatPrice(tempPrice);

  const name = product?.name || "Producto sin nombre";

  // 4. Badges (máximo 2): terreno activo + descuento cuando aplica (+ "Nuevo" en productos reales)
  const hasDiscount = fromApi
    ? product?.discount > 0
    : pvp && Number(originalPrice) > tempPrice && Number(originalPrice) > 0;
  const discountPct = fromApi
    ? product?.discount || 0
    : hasDiscount
      ? Math.round(((Number(originalPrice) - tempPrice) / Number(originalPrice)) * 100)
      : 0;
  const badges = [
    ...(finalTerrain ? [finalTerrain] : []),
    ...(hasDiscount ? [{ type: "discount", label: `${discountPct}%` }] : []),
    ...(fromApi && product?.isNew ? [{ type: "new", label: "NUEVO" }] : []),
  ];

  // Modelo y medida (solo productos que los usan, ej: llantas)
  const modelLine = fromApi ? [product?.model, product?.measure].filter(Boolean).join(" · ") : "";
  // Beneficios del producto
  const perks = fromApi
    ? [
        product?.freeShipping && "Envío gratis",
        product?.warranty && "Garantía",
        product?.returns && "Devoluciones",
      ].filter(Boolean)
    : [];

  // Tamaños según la variante (normal / compacta)
  const sz = compact
    ? {
        pad: "px-2",
        sash: "h-6",
        logo: "h-5",
        logoWrap: "pb-1 pt-2",
        img: "mx-2 aspect-[16/10]",
        imgPad: "p-1.5",
        price: "text-lg",
        name: "text-[11px] min-h-[2.6em]",
        qty: "h-7 w-[62px]",
        qtyBtn: "w-5",
        btn: "h-7 flex-1 text-[10px]",
      }
    : {
        pad: "px-3",
        sash: "h-9",
        logo: "h-8",
        logoWrap: "pb-1.5 pt-3",
        img: "mx-3 aspect-[4/3]",
        imgPad: "p-3",
        price: "text-2xl",
        name: "text-xs min-h-[2.75em]",
        qty: "h-8 w-[80px]",
        qtyBtn: "w-6",
        btn: "h-8 text-xs min-[440px]:text-[13px]",
      };

  const terrainStyles = {
    AT: "bg-[#e8f0fe] text-[#1a3a8f] border-[#a8c0f0]",
    MT: "bg-[#fef3e2] text-[#7a4800] border-[#f0c87a]",
    LT: "bg-[#eaf3de] text-[#27500a] border-[#a0cc6a]",
  };

  // Especificaciones reales (ícono + valor) o las de ejemplo del diseño original
  const apiSpecItems = fromApi
    ? (product?.specs || []).slice(0, 3).map((spec) => ({
        key: spec.id,
        value: spec.value,
        title: spec.name,
        iconBg: "bg-[#f0f0f0]",
        icon: spec.icon ? (
          <img src={spec.icon} alt="" className="h-[10px] w-[10px] object-contain" />
        ) : (
          <svg width="10" height="10" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="4" fill="#888" />
          </svg>
        ),
      }))
    : null;

  const specItems = apiSpecItems || [
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

  // 5. Pedido por WhatsApp con medida, precio, cantidad y enlace al producto
  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (agotado) return;

    openWhatsApp({
      message: buildProductMessage({ ...product, name, finalPrice: tempPrice }, { qty }),
      source: compact ? "tarjeta_destacados" : "tarjeta",
      product: { ...product, name, finalPrice: tempPrice },
      qty,
    });
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
      {finalSash && (
        <img src={finalSash} alt="Promoción" className={`block ${sz.sash} w-full object-cover`} loading="lazy" decoding="async" />
      )}

      {/* --- BANNER / LOGO DE MARCA --- */}
      <div className={`flex justify-center ${sz.pad} ${sz.logoWrap}`}>
        {finalBrandDisplay ? (
          <img src={finalBrandDisplay} alt={product?.brand || "Marca"} className={`${sz.logo} max-w-[90%] object-contain`} loading="lazy" decoding="async" />
        ) : (
          <span className="text-[11px] font-black uppercase tracking-wide text-gray-500">
            {product?.brand || "MARCA C.A."}
          </span>
        )}
      </div>

      {/* --- IMAGEN HERO + BADGES --- */}
      <Link
        to={`/product/${product?.id || "#"}`}
        className={`group relative ${sz.img} flex items-center justify-center overflow-hidden rounded-lg bg-white`}
        style={{ textDecoration: "none" }}
        title={`Ver detalles de ${name}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src={finalTireSrc}
          alt={name}
          className={`h-full w-full object-contain ${sz.imgPad} transition-transform duration-300 group-hover:scale-[1.04]`}
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = '/llanta1.webp'; }}
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
                {badge.type === "discount" ? `-${badge.label}` : badge.label}
              </span>
            )
          )}
        </div>

        {agotado && (
          <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-md bg-[#222]/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Agotado
          </span>
        )}
      </Link>

      {/* --- PRECIO --- */}
      <div className={`flex items-center justify-between ${sz.pad} ${compact ? "pt-2" : "pt-3"}`}>
        <div className="flex flex-col">
          <div className="flex items-baseline gap-0.5">
            <span className={`${sz.price} font-bold leading-none text-[#e83a2b]`}>${int}</span>
            <sup className="text-[11px] font-bold text-[#e83a2b]">.{dec}</sup>
            <span className="ml-0.5 text-[10px] font-medium text-gray-400">+ IVA</span>
          </div>
          {originalPrice ? (
            <span className="text-[10px] text-gray-400 line-through">
              PVP ${Number(originalPrice).toFixed(2)}
            </span>
          ) : (
            <span className="text-[10px] text-transparent select-none">.</span>
          )}
        </div>
        {show247 && !compact && (
          <img
            src="/1.webp"
            alt="Promoción"
            className="hidden h-7 w-7 shrink-0 rounded-full border border-black/10 object-cover shadow-sm min-[440px]:block"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </div>

      {/* --- NOMBRE: siempre 2 líneas para uniformidad de altura --- */}
      <div className={`${sz.pad} pt-1.5`}>
        <p
          className={`my-0 line-clamp-2 ${sz.name} font-semibold leading-snug text-[#222]`}
          title={name}
        >
          {name}
        </p>
        {modelLine && (
          <p className="my-0 truncate text-[10px] font-medium text-gray-500" title={modelLine}>
            {modelLine}
          </p>
        )}
      </div>

      {/* --- SPECS COMPACTAS (se ocultan si el producto no tiene) --- */}
      {specItems.length > 0 && !compact && (
        <div className={`flex items-center ${compact ? "gap-2" : "gap-3"} ${sz.pad} pt-1.5`}>
          {specItems.map((spec) => (
            <div key={spec.key} className="flex min-w-0 items-center gap-1" title={spec.title}>
              <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full ${spec.iconBg}`}>
                {spec.icon}
              </span>
              <span className="truncate text-[10px] font-semibold text-gray-500">{spec.value}</span>
            </div>
          ))}
        </div>
      )}

      {perks.length > 0 && !compact && (
        <p className="my-0 px-3 pt-1 text-[10px] font-medium text-gray-400">{perks.join(" · ")}</p>
      )}

      {/* --- ACCIONES: botón alineado al fondo en todas las tarjetas --- */}
      <div className={`mt-auto flex items-center ${compact ? "gap-1.5" : "gap-2"} ${sz.pad} pb-2 pt-1.5`}>
        {/* Selector de cantidad compacto */}
        <div className={`group flex ${sz.qty} shrink-0 items-center justify-between overflow-hidden rounded-[10px] border border-gray-200 bg-white transition-colors duration-200 hover:border-[#e83a2b] hover:bg-[#e83a2b]`}>
          <button
            data-slot="stepper-btn"
            className={`flex h-full ${sz.qtyBtn} items-center justify-center border-none bg-transparent p-0 text-gray-400 transition-colors duration-200 group-hover:text-white`}
            onClick={handleDecrement}
            aria-label="Disminuir cantidad"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>
          </button>
          <span className="min-w-[14px] text-center text-xs font-bold text-[#1a1a1a] transition-colors duration-200 group-hover:text-white">{qty}</span>
          <button
            data-slot="stepper-btn"
            className={`flex h-full ${sz.qtyBtn} items-center justify-center border-none bg-transparent p-0 text-gray-400 transition-colors duration-200 group-hover:text-white`}
            onClick={handleIncrement}
            aria-label="Aumentar cantidad"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </div>
        {/* Botón principal */}
        <button
          data-slot="action-btn"
          className={`flex ${sz.btn} flex-1 items-center justify-center gap-1 rounded-[10px] border-none bg-[#e83a2b] p-0 font-bold text-white transition-colors hover:bg-[#d0281b] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300`}
          onClick={handleBuy}
          disabled={agotado}
          title={agotado ? "Producto agotado" : "Pedir por WhatsApp"}
          aria-label={agotado ? "Producto agotado" : `Pedir ${name} por WhatsApp`}
        >
          <svg className={`shrink-0 ${agotado ? "hidden" : "block"}`} width={compact ? 12 : 14} height={compact ? 12 : 14} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path d="M16.01 2.667c-7.364 0-13.343 5.98-13.343 13.343 0 2.357.617 4.57 1.7 6.494L2.667 29.333l6.99-1.833a13.28 13.28 0 0 0 6.353 1.617h.006c7.364 0 13.343-5.98 13.343-13.343S23.374 2.667 16.01 2.667zm0 24.42a11.02 11.02 0 0 1-5.617-1.54l-.403-.24-4.15 1.088 1.108-4.045-.263-.417a11.02 11.02 0 0 1-1.687-5.883c0-6.106 4.97-11.076 11.086-11.076 2.96 0 5.744 1.154 7.836 3.246a11 11 0 0 1 3.246 7.836c0 6.117-4.97 11.086-11.09 11.086z" />
          </svg>
          {agotado ? "Agotado" : "Pedir"}
        </button>
      </div>
    </div>
  );
};

export default TireCard;
