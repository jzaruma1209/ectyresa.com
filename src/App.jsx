import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import store from "./store";
import { logout } from "./store/slices/auth.slice";
import CartInitializer from "./components/cart/CartInitializer";
import AppRouter from "./router";
import "./App.css";

/**
 * Componente que escucha el evento custom 'auth:logout'
 * disparado por el interceptor de API cuando recibe un 401.
 * Limpia el estado de auth en Redux.
 */
const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [dispatch]);

  return null;
};

function App() {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <CartInitializer />
      <AppRouter />
    </Provider>
  );
}

export default App;

