import { memo, useState } from "react";
import {
  Battery,
  CarFront,
  Circle,
  Container,
  Disc,
  Droplets,
  Factory,
  Flame,
  LayoutGrid,
  Settings,
  Sparkles,
  Tractor,
  TrendingUp,
  Truck,
} from "lucide-react";
import "../../features/home/styles/CategoryBar.css";

const CATEGORIES = [
  { id: "todo", label: "Todo", icon: LayoutGrid },
  { id: "llantas", label: "Llantas", icon: Disc },
  { id: "suv", label: "SUV", icon: CarFront },
  { id: "camionetas", label: "Camionetas", icon: Truck },
  { id: "camiones", label: "Camiones", icon: Container },
  { id: "agricola", label: "Agrícola", icon: Tractor },
  { id: "maquinaria", label: "Maquinaria", icon: Factory },
  { id: "accesorios", label: "Accesorios", icon: Settings },
  { id: "aceites", label: "Aceites", icon: Droplets },
  { id: "baterias", label: "Baterías", icon: Battery },
  { id: "aros", label: "Aros", icon: Circle },
  { id: "mas-vendidos", label: "Más vendidos", icon: TrendingUp },
  { id: "promociones", label: "Promociones", icon: Flame },
  { id: "nuevos", label: "Nuevos", icon: Sparkles },
];

const CategoryBar = () => {
  const [selected, setSelected] = useState("todo");

  // Por ahora solo selección local; en el futuro navegará a /busqueda?q=...
  const handleClick = (category) => {
    setSelected(category.id);
    console.log(category.label);
  };

  return (
    <div className="category-bar">
      <div className="category-bar-inner">
        <nav className="category-bar-scroll" aria-label="Categorías de productos">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = selected === category.id;

            return (
              <button
                key={category.id}
                type="button"
                className={`category-pill${isActive ? " is-active" : ""}`}
                onClick={() => handleClick(category)}
                aria-label={`Categoría ${category.label}`}
                aria-pressed={isActive}
              >
                <Icon className="category-pill-icon" aria-hidden="true" />
                <span>{category.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default memo(CategoryBar);
