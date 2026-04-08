import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function StaggeredMenu({
  isOpen,
  onClose,
  position = "right",
  children,
  // La magia: 3 capas de colores para el efecto "wipe" en cascada.
  // Orden: Roja primero, Negra segundo, Blanca final
  colors = ['#E60000', '#1A1A1A', '#FFFFFF'], 
  accentColor = '#E60000',
}) {
  const containerRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null); // Es el fondo principal donde están los links
  const bgRef = useRef(null);
  const contentWrapperRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (isOpen) {
      document.body.style.overflow = "hidden"; 
      
      const tl = gsap.timeline();
      
      tl.to(containerRef.current, { duration: 0, css: { display: "block" } })
        .to(bgRef.current, { duration: 0.3, opacity: 0.7, ease: "power2.out" })
        
        // Animación "Stagger" de Múltiples Capas (El efecto ReactBits)
        // Capa 1: ROJA (entra primero, se ve claramente)
        .fromTo(layer1Ref.current, 
          { x: position === "right" ? "100%" : "-100%" },
          { duration: 0.6, x: "0%", ease: "power4.inOut" },
          "<0.1"
        )
        // Capa 2: NEGRA (entra después, pisa a la roja con retraso visible)
        .fromTo(layer2Ref.current, 
          { x: position === "right" ? "100%" : "-100%" },
          { duration: 0.6, x: "0%", ease: "power4.inOut" },
          "-=0.35"
        )
        // Capa 3: BLANCA (entra al final, pisa a la negra)
        .fromTo(layer3Ref.current, 
          { x: position === "right" ? "100%" : "-100%" },
          { duration: 0.6, x: "0%", ease: "power4.inOut" },
          "-=0.35"
        )
        
        // El contenido arranca oculto y entra suavemente
        .fromTo(contentWrapperRef.current,
          { opacity: 0, y: 30 },
          { duration: 0.5, opacity: 1, y: 0, ease: "power3.out" },
          "-=0.15"
        );

    } else {
      document.body.style.overflow = "";

      const tl = gsap.timeline();
      
      tl.to(contentWrapperRef.current, {
        duration: 0.2, opacity: 0, y: 20, ease: "power2.in"
      })
      
      // Salen las capas en reversa
      .to(layer3Ref.current, {
        duration: 0.6, x: position === "right" ? "100%" : "-100%", ease: "power4.inOut"
      }, "-=0.1")
      .to(layer2Ref.current, {
        duration: 0.6, x: position === "right" ? "100%" : "-100%", ease: "power4.inOut"
      }, "-=0.5")
      .to(layer1Ref.current, {
        duration: 0.6, x: position === "right" ? "100%" : "-100%", ease: "power4.inOut"
      }, "-=0.5")
      
      .to(bgRef.current, { duration: 0.3, opacity: 0, ease: "power2.in" }, "-=0.3")
      .to(containerRef.current, { duration: 0, css: { display: "none" } });
    }

    return () => { document.body.style.overflow = ""; };
  }, [isOpen, position]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[1100] hidden" style={{ willChange: "opacity" }}>
      
      {/* Fondo oscuro overlay */}
      <div 
        ref={bgRef}
        className="absolute inset-0 bg-black opacity-0 cursor-pointer"
        onClick={onClose}
      />

      {/* COMPONENTES DE LAS "MÚLTIPLES" CAPAS */}
      <div 
        ref={layer1Ref} 
        className="absolute top-0 bottom-0 right-0 w-full sm:w-[450px]" 
        style={{ backgroundColor: colors[0], willChange: "transform" }}
      />
      <div 
        ref={layer2Ref} 
        className="absolute top-0 bottom-0 right-0 w-full sm:w-[450px]" 
        style={{ backgroundColor: colors[1], willChange: "transform" }}
      />
      
      {/* Capa Final (Blanca) que hospeda todo el contenido */}
      <div 
        ref={layer3Ref}
        className="absolute top-0 bottom-0 right-0 w-full sm:w-[450px] shadow-2xl overflow-y-auto"
        style={{ backgroundColor: colors[2], willChange: "transform" }}
      >
        {/* Botón de Cerrar — Bien visible */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#1A1A1A] text-white text-2xl flex items-center justify-center hover:bg-[#E60000] transition-colors shadow-lg"
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col pt-20 px-8 pb-8 opacity-0">
          {children}
        </div>
      </div>

    </div>
  );
}
