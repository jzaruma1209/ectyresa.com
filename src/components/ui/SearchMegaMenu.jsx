import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Icono simple de flecha diagonal
const GoArrowUpRight = () => (
  <svg 
    stroke="currentColor" fill="none" strokeWidth="2" 
    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" 
    height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const SearchMegaMenu = ({ isOpen, items, onClose }) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const tlRef = useRef(null);

  useLayoutEffect(() => {
    // Set initial states hidden
    gsap.set(containerRef.current, { height: 0, opacity: 0, overflow: 'hidden' });
    gsap.set(cardsRef.current, { y: 20, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    // Animate wrapper height and opacity
    tl.to(containerRef.current, {
      height: 'auto',
      opacity: 1,
      duration: 0.35,
      ease: 'power3.out'
    });

    // Animate cards staggering upwards
    tl.to(cardsRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
      stagger: 0.08
    }, '-=0.2');

    tlRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [items]);

  useLayoutEffect(() => {
    if (isOpen) {
      tlRef.current?.play();
    } else {
      tlRef.current?.reverse();
    }
  }, [isOpen]);

  const setCardRef = i => el => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: '8px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E0E0E0',
        zIndex: 100,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      <button 
        onClick={(e) => {
          e.preventDefault();
          if (onClose) onClose();
        }}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: '#999',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#E60000'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
        aria-label="Cerrar menú"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div style={{ padding: '24px 16px 16px 16px', display: 'flex', gap: '16px' }}>
        {(items || []).map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            ref={setCardRef(idx)}
            style={{
              backgroundColor: item.bgColor,
              color: item.textColor,
              flex: '1 1 0',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '120px',
              transition: 'background 0.3s ease, color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(90deg, #3A2935 0%, #141414 50%, #3A2935 100%)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = item.bgColor;
              e.currentTarget.style.color = item.textColor;
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '12px', letterSpacing: '-0.3px' }}>
              {item.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              {item.links?.map((lnk, i) => (
                <a
                  key={`${lnk.label}-${i}`}
                  href={lnk.href}
                  className="search-mega-link"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                    color: 'inherit',
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#E60000';
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'inherit';
                    e.currentTarget.style.opacity = '0.85';
                  }}
                >
                  <GoArrowUpRight />
                  {lnk.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SearchMegaMenu);
