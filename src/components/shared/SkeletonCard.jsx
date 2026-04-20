/**
 * SkeletonCard — Placeholder animado mientras cargan los productos
 *
 * Reemplaza el genérico "Buscando productos..." por una UI que
 * mantiene el layout y reduce el CLS (Cumulative Layout Shift).
 *
 * CSS puro, sin dependencias externas.
 * Paleta Ectyre: fondos grises claros (#F5F5F5 → #E8E8E8)
 */

import './SkeletonCard.css';

const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton-card__image skeleton-shimmer" />
    <div className="skeleton-card__body">
      <div className="skeleton-card__line skeleton-shimmer" style={{ width: '80%', height: '14px' }} />
      <div className="skeleton-card__line skeleton-shimmer" style={{ width: '55%', height: '12px' }} />
      <div className="skeleton-card__line skeleton-shimmer" style={{ width: '40%', height: '12px' }} />
      <div className="skeleton-card__price skeleton-shimmer" style={{ width: '60%', height: '22px' }} />
      <div className="skeleton-card__btn skeleton-shimmer" />
    </div>
  </div>
);

/**
 * SkeletonGrid — Renderiza N skeletons en grid
 * @param {number} count — Número de skeletons a mostrar (default: 8)
 */
export const SkeletonGrid = ({ count = 8 }) => (
  <div className="skeleton-grid" role="status" aria-label="Cargando productos…">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
