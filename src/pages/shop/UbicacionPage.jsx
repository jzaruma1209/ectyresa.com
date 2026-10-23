import React from 'react';
import MapaDistribuidores from '../../components/MapaDistribuidores';
import { usePageMeta } from '../../hooks/usePageMeta';

const UbicacionPage = () => {
  usePageMeta({
    title: 'Ubicación y tienda en La Troncal, Cañar',
    description: 'Visita ECTYRE S.A. en la Av. 25 de Agosto y calle Galápagos, La Troncal, Cañar. Compra llantas para auto, camioneta, camión y maquinaria.',
  });
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Tienda de llantas en La Troncal, Cañar</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Visítanos en la Av. 25 de Agosto y calle Galápagos para comprar e instalar llantas para auto, camioneta, camión y maquinaria.
      </p>
      
      <MapaDistribuidores />
    </div>
  );
};

export default UbicacionPage;
