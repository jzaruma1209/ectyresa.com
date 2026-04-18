/* ═══════════════════════════════════════════════════════════════
   CartToast.jsx — Toast de confirmación al agregar al carrito
   Se muestra brevemente cuando un producto se agrega exitosamente.
   Observa cambios en el cart.itemCount para dispararse.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './styles/CartToast.css';

const CartToast = () => {
  const { itemCount, loading } = useSelector((state) => state.cart);
  const [visible, setVisible] = useState(false);
  const prevCount = useRef(itemCount);
  const timerRef = useRef(null);

  useEffect(() => {
    // Solo mostrar toast cuando itemCount aumenta (se agrega algo)
    if (itemCount > prevCount.current && !loading) {
      setVisible(true);

      // Limpiar timer anterior
      if (timerRef.current) clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 3000);
    }

    prevCount.current = itemCount;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [itemCount, loading]);

  if (!visible) return null;

  return (
    <div className="cart-toast">
      <div className="cart-toast-content">
        <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="20" height="20">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>¡Producto agregado al carrito!</span>
        <Link to="/cart" className="cart-toast-link" onClick={() => setVisible(false)}>
          Ver carrito
        </Link>
        <button className="cart-toast-close" onClick={() => setVisible(false)} aria-label="Cerrar">
          ×
        </button>
      </div>
    </div>
  );
};

export default CartToast;
