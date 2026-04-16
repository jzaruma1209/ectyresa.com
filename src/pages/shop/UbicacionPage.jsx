import React from 'react';
import MapaDistribuidores from '../../components/MapaDistribuidores';

const UbicacionPage = () => {
  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>Nuestra Ubicación</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Encuentra nuestro distribuidor autorizado más cercano en todo el Ecuador.</p>
      
      <MapaDistribuidores />
    </div>
  );
};

export default UbicacionPage;
