import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import 'leaflet/dist/leaflet.css';
import './utils/leafletIconFix';
import './index.css'
import './responsive.css'
import App from './App.jsx'
import AppLoader from './components/shared/AppLoader.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Suspense raíz: cubre la carga del chunk de App y sus dependencias iniciales */}
    <Suspense fallback={<AppLoader />}>
      <App />
    </Suspense>
  </StrictMode>,
)
