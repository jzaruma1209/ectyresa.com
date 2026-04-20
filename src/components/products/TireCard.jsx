import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCart } from "../../hooks/useCart";
import { openAuthModal } from "../../store/slices/authModal.slice";

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
  const { addToCart } = useCart();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
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

  const terrainOptions = ["AT", "MT", "LT"];
  const terrainStyles = {
    AT: "bg-[#e8f0fe] text-[#1a3a8f] border-[#a8c0f0]",
    MT: "bg-[#fef3e2] text-[#7a4800] border-[#f0c87a]",
    LT: "bg-[#eaf3de] text-[#27500a] border-[#a0cc6a]",
  };

  const name = product?.name || "Producto sin nombre";

  // 4. Lógica de Integración con el Sistema Ectyre (useCart)
  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      dispatch(openAuthModal({ type: 'ADD_TO_CART', payload: product, quantity: qty }));
      return;
    }

    // Usa el hook global con la cantidad local visual!
    addToCart(product, qty);
  };

  return (
    <div className="bg-white border-[0.5px] border-black/10 rounded-xl w-[220px] overflow-hidden font-sans hover:shadow-md transition-shadow">
      {/* --- SASH BANDA PROMOCIONAL --- */}
      {sashSrc ? (
        <img src={sashSrc} alt="Promoción" className="w-full h-9 object-cover block" loading="lazy" decoding="async" />
      ) : (
        <div className="w-full h-9 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-bold tracking-widest bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]">
          [PROMO SASH]
        </div>
      )}

      {/* --- LOGO DE MARCA --- */}
      <div className="px-3 py-[6px] flex justify-center border-b-[0.5px] border-black/5">
        {brandLogoSrc ? (
          <img src={brandLogoSrc} alt="Marca" className="h-[28px] object-contain" loading="lazy" decoding="async" />
        ) : (
          <div className="w-[110px] h-[28px] bg-gray-50 border-[1px] border-dashed border-gray-300 rounded-md flex items-center justify-center text-[11px] text-gray-500 font-black uppercase tracking-wide">
            {product?.brand || "MARCA C.A."}
          </div>
        )}
      </div>

      {/* --- IMAGEN MATRÍZ Y SPECS LATERALES --- */}
      <Link
        to={`/product/${product?.id || "#"}`}
        className="px-2.5 pt-2.5 pb-1.5 flex gap-1.5 items-start"
        style={{ textDecoration: "none" }}
        title={`Ver detalles de ${name}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img 
          src={finalTireSrc} 
          alt={name} 
          className="flex-1 w-0 h-[130px] object-contain"
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = '/llanta1.png'; }}
        />

        <div className="flex flex-col gap-1.5 pt-1 items-center">
          
          <div className="flex flex-col gap-[3px] items-center">
            {terrainOptions.map((t) => {
              const active = t === finalTerrain;
              const tailwindClasses = terrainStyles[t];
              return (
                <span
                  key={t}
                  className={`rounded text-[9px] font-medium px-1.5 py-0.5 text-center leading-tight border-[0.5px] ${tailwindClasses} transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-30'}`}
                >
                  {t}
                </span>
              );
            })}
          </div>

          <div className="w-[0.5px] bg-black/10 h-2.5" />

          <div className="flex flex-col gap-[5px]">
             {/* Especificación Wet */}
            <div className="flex items-center gap-1" title="Adherencia en mojado">
              <div className="w-[18px] h-[18px] rounded-full bg-[#fde8e8] flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 16 16">
                  <path d="M8 1 C5 4 2 6 2 10 a6 6 0 0 0 12 0 C14 6 11 4 8 1z" fill="#e83a2b" />
                </svg>
              </div>
              <span className="text-[10px] text-[#888] font-semibold">{finalSpecs.wet}</span>
            </div>
             {/* Especificación Dry */}
            <div className="flex items-center gap-1" title="Rendimiento en seco">
              <div className="w-[18px] h-[18px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="5" fill="none" stroke="#888" strokeWidth="2" />
                  <path d="M8 4 v4 l3 2" stroke="#888" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[10px] text-[#888] font-semibold">{finalSpecs.dry}</span>
            </div>
            {/* Especificación Ruido */}
            <div className="flex items-center gap-1" title="Decibeles de ruido">
              <div className="w-[18px] h-[18px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 16 16">
                  <path d="M2 10 Q5 4 8 8 Q11 12 14 6" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[10px] text-[#888] font-semibold">{finalSpecs.noise}</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="border-t-[0.5px] border-t-black/10 mx-3" />

      {/* --- CORTINA DE PRECIO --- */}
      <div className="px-3 pt-2.5 pb-1 flex items-center gap-2">
        {show247 && (
          <img 
            src="/1.png" 
            alt="Promoción" 
            className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm border-[0.5px] border-black/10"
            onError={(e) => e.target.style.display = 'none'} // Si no existe localmente, se oculta para no romper el diseño
          />
        )}
        <div className="flex flex-col gap-[1px]">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xl font-bold text-[#e83a2b]">${int}</span>
            <sup className="text-[11px] font-bold text-[#e83a2b]">.{dec}</sup>
            <span className="text-[11px] font-semibold text-[#888] ml-1 tracking-tight">+ IVA</span>
          </div>
          <span className="text-[10px] text-gray-400 line-through">PVP ${Number(originalPrice).toFixed(2)}</span>
        </div>
      </div>

      {/* --- NOMBRE --- */}
      <div className="px-3 pb-1 h-[28px] overflow-hidden">
        <p className="text-xs font-semibold text-[#222] my-0 leading-tight line-clamp-2" title={name}>
          {name}
        </p>
      </div>

      {/* --- ACCIONES --- */}
      <div className="px-3 pt-2 pb-3 flex items-center gap-2">
        {/* Selector de cantidad */}
        <div className="flex items-center border-[0.5px] border-black/20 bg-gray-50 rounded-lg overflow-hidden shrink-0">
          <button
            className="bg-transparent border-none px-2.5 py-1.5 text-[15px] cursor-pointer text-[#555] leading-none hover:bg-black/5 hover:text-black transition-colors"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty((q) => Math.max(1, q - 1)); }}
          >
            −
          </button>
          <span className="text-[13px] font-bold min-w-[20px] text-center text-[#1a1a1a]">{qty}</span>
          <button
            className="bg-transparent border-none px-2.5 py-1.5 text-[15px] cursor-pointer text-[#555] leading-none hover:bg-black/5 hover:text-black transition-colors"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty((q) => q + 1); }}
          >
            +
          </button>
        </div>
        {/* Boton Comprar */}
        <button
          className="bg-[#e83a2b] text-white shadow-sm border-none rounded-lg py-[9px] px-2 text-[13px] font-bold cursor-pointer flex items-center justify-center gap-1.5 flex-1 hover:bg-[#d0281b] active:scale-[0.98] transition-all"
          onClick={handleBuy}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Comprar
        </button>
      </div>
    </div>
  );
};

export default TireCard;
