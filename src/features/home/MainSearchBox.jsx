import { useState } from "react";

const MainSearchBox = () => {
  const [activeVehicle, setActiveVehicle] = useState("auto");
  const [searchMode, setSearchMode] = useState("dimension");
  const [selectedWidth, setSelectedWidth] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const vehicles = [
    { id: "auto", label: "AUTO" },
    { id: "agricola", label: "AGRÍCOLA" },
    { id: "camion", label: "CAMIÓN" },
  ];

  const widthValues = [16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
  const moreWidthValues = [31, 32, 33, 34, 35, 36];

  const displayedWidths = showMore ? [...widthValues, ...moreWidthValues] : widthValues;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">
      {/* Contenedor principal con fondo degradado */}
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Tabs de vehículos */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white/10">
          <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider ml-2">
            ESCOGE EL TIPO DE VEHÍCULO:
          </span>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setActiveVehicle(vehicle.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all focus:outline-none ${
                  activeVehicle === vehicle.id
                    ? "bg-red-600 text-white shadow-lg"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {vehicle.label}
              </button>
            ))}       
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-4">
          {/* Label para modo de búsqueda */}
          <div className="flex items-center mb-3">
            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest ml-1">
              BUSCA TU LLANTA IDEAL POR:
            </span>
          </div>
          {/* Botones de modo de búsqueda */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setSearchMode("dimension")}
              className={`flex items-center justify-center p-3 rounded-xl transition-all border-2 focus:outline-none ${
                searchMode === "dimension"
                  ? "bg-red-600 border-red-600 shadow-lg scale-[1.02]"
                  : "bg-transparent border-white/20 hover:border-white/40"
              }`}
            >
              <span className={`font-bold text-sm tracking-wider ${searchMode === "dimension" ? "text-white" : "text-white/70"}`}>
                POR DIMENSIÓN
              </span>
            </button>

            <button
              onClick={() => setSearchMode("vehiculo")}
              className={`flex items-center justify-center p-3 rounded-xl transition-all border-2 focus:outline-none ${
                searchMode === "vehiculo"
                  ? "bg-red-600 border-red-600 shadow-lg scale-[1.02]"
                  : "bg-transparent border-white/20 hover:border-white/40"
              }`}
            >
              <span className={`font-bold text-sm tracking-wider ${searchMode === "vehiculo" ? "text-white" : "text-white/70"}`}>
                EN VEHÍCULO
              </span>
            </button>
          </div>

          {/* Área de contenido principal */}
          <div className="bg-white rounded-xl p-6 shadow-inner">
            
            {/* Selector */}
            <div>
              {searchMode === "dimension" ? (
                <>
                  {/* Título */}
                  <h3 className="text-lg font-black text-gray-900 mb-6 text-center">
                    SELECCIONE EL <span className="text-red-600">ANCHO</span>
                  </h3>

                  {/* Imagen de llanta con indicadores */}
                  <div className="relative mb-8 flex justify-center">
                    <img 
                      src="/infollanta.svg" 
                      alt="Información de llanta" 
                      className="h-32 w-auto object-contain"
                    />
                  </div>

                  {/* Grid de valores */}
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 mb-6">
                    {displayedWidths.map((width) => (
                      <button
                        key={width}
                        onClick={() => setSelectedWidth(width)}
                        className={`py-3 rounded-xl font-bold transition-all text-sm border-2 focus:outline-none ${
                          selectedWidth === width
                            ? "bg-red-600 border-red-600 text-white shadow-md scale-105"
                            : "bg-white border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"
                        }`}
                      >
                        {width}
                      </button>
                    ))}
                  </div>

                  {/* Botón mostrar más */}
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowMore(!showMore)}
                      className="group flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white rounded-full font-bold hover:bg-red-600 transition-all text-sm shadow-lg"
                    >
                      <span>{showMore ? "VER MENOS" : "VER TODOS LOS VALORES"}</span>
                      <svg className={`w-4 h-4 transition-transform ${showMore ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">🚗</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-800">Búsqueda por Vehículo</h4>
                  <p className="text-sm text-gray-500 text-center max-w-xs mt-2">
                    Estamos actualizando nuestro catálogo para ofrecerte la mejor precisión.
                  </p>
                  <div className="mt-6 px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold animate-pulse">
                    PRÓXIMAMENTE
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSearchBox;
