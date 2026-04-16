import { useState } from "react";
import TireSearcher from "./TireSearcher";
import VehicleSearcher from "./VehicleSearcher";

const MainSearchBox = ({ activeVehicle, onVehicleChange }) => {
  const [searchMode, setSearchMode] = useState("dimension");

  const vehicles = [
    { id: "auto", label: "AUTO" },
    { id: "agricola", label: "AGRÍCOLA" },
    { id: "camion", label: "CAMIÓN" },
    { id: "maquinaria", label: "MAQUINARIA PESADA / CONSTRUCCIÓN" },
  ];

  return (
    <div className="relative rounded-2xl overflow-hidden h-full" style={{ background: "rgba(17, 24, 39, 0.70)" }}>

        {/* Blob izquierdo de color */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-1/2 -translate-y-1/2 -z-0 blur-3xl opacity-40"
          style={{ clipPath: "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" }}
        >
          <div className="aspect-[577/310] w-[22rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc]" />
        </div>

        {/* Blob derecho de color */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 -z-0 blur-3xl opacity-40"
          style={{ clipPath: "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)" }}
        >
          <div className="aspect-[577/310] w-[22rem] bg-gradient-to-r from-[#9089fc] to-[#ff80b5]" />
        </div>

        {/* Línea inferior sutil */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10" />

        {/* Tabs de vehículos */}
        <div className="p-2 pb-0">
          <div className="flex items-center mb-1.5">
            <span className="text-white/70 text-[9px] font-bold uppercase tracking-wider ml-1">
              ESCOGE EL TIPO DE VEHÍCULO:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => onVehicleChange(vehicle.id)}
                className={`flex items-center justify-center p-1.5 rounded-xl transition-all border-2 focus:outline-none ${activeVehicle === vehicle.id
                  ? "shadow-md scale-[1.02]"
                  : "bg-transparent border-white/20 hover:border-white/40"
                  }`}
                style={{
                  backgroundColor: activeVehicle === vehicle.id ? 'var(--hero-accent)' : 'transparent',
                  borderColor: activeVehicle === vehicle.id ? 'var(--hero-accent)' : 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <span className={`font-bold text-[11px] tracking-wider text-center leading-tight ${activeVehicle === vehicle.id ? "text-white" : "text-white/70"}`}>
                  {vehicle.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenido principal */}
        {/* Contenido principal */}
        <div className="p-2">
          {/* Botones de modo de búsqueda */}
          <div className="flex flex-wrap items-center gap-2 p-2 bg-white/10 rounded-xl mb-2">
            <span className="text-white/60 text-[9px] font-bold uppercase tracking-widest ml-2">
              BUSCA TU LLANTA IDEAL POR:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSearchMode("dimension")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all focus:outline-none ${searchMode === "dimension"
                  ? "text-white shadow-md"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                style={{
                  backgroundColor: searchMode === "dimension" ? 'var(--hero-accent)' : 'rgba(255,255,255,0.1)'
                }}
              >
                POR DIMENSIÓN
              </button>

              <button
                onClick={() => setSearchMode("vehiculo")}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all focus:outline-none ${searchMode === "vehiculo"
                  ? "text-white shadow-md"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                style={{
                  backgroundColor: searchMode === "vehiculo" ? 'var(--hero-accent)' : 'rgba(255,255,255,0.1)'
                }}
              >
                EN VEHÍCULO
              </button>
            </div>
          </div>

          {/* Área de contenido principal */}
          <div className="bg-white rounded-xl p-2 shadow-inner" style={{ position: 'relative', zIndex: 10 }}>
            {searchMode === "dimension" ? (
              <TireSearcher />
            ) : (
              <VehicleSearcher />
            )}
          </div>
        </div>
    </div>
  );
};

export default MainSearchBox;
