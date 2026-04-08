// Fase 4 — CartInitializer actualizado
// Carga el carrito desde el BACKEND al iniciar la app.
// Reemplaza la carga desde localStorage de la versión anterior.
// Funciona tanto para usuarios logueados como para invitados (con sesionId).

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCarrito } from '../../store/slices/cart.slice';

/**
 * Componente que inicializa el carrito desde el backend.
 * Debe usarse una sola vez en App.jsx.
 * No renderiza nada en pantalla.
 */
const CartInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Carga el carrito del backend. El interceptor de api.js se encarga
    // de inyectar el JWT si existe, o de usar el sesionId de invitado.
    dispatch(fetchCarrito());
  }, [dispatch]);

  return null;
};

export default CartInitializer;
