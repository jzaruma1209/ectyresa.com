import { Provider } from "react-redux";
import store from "./store";
import CartInitializer from "./components/cart/CartInitializer";
import AppRouter from "./router";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <CartInitializer />
      <AppRouter />
    </Provider>
  );
}

export default App;
