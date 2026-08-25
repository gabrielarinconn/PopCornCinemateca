import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PosterCard, type PosterCardProps } from './PosterCard';

const COLUMNS = 4;
const ROW_HEIGHT_ESTIMATE_PX = 340;

export interface VirtualizedPosterGridItem extends PosterCardProps {
  id: string;
}

export interface VirtualizedPosterGridProps {
  items: VirtualizedPosterGridItem[];
}

/**
 * Virtualiza por filas, no por tarjeta individual — con miles de resultados
 * solo las filas visibles (más el margen de `overscan`) llegan al DOM, así
 * que la memoria no crece sin techo por más que la lista siga creciendo.
 */
export function VirtualizedPosterGrid({ items }: VirtualizedPosterGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = Math.ceil(items.length / COLUMNS);

  // eslint-disable-next-line react-hooks/incompatible-library -- @tanstack/react-virtual expone funciones no memoizables por diseño; es una incompatibilidad conocida con el compilador de React, no un uso incorrecto.
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT_ESTIMATE_PX,
    overscan: 3,
    // Antes de que el ResizeObserver mida el contenedor real (o en jsdom,
    // que nunca calcula layout de verdad), sin esto el virtualizador asume
    // una ventana de 0px y no renderiza ninguna fila.
    initialRect: { width: 1024, height: 800 },
  });

  return (
    <div ref={parentRef} className="h-[70vh] overflow-y-auto">
      <div style={{ height: `${String(virtualizer.getTotalSize())}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const rowItems = items.slice(
            virtualRow.index * COLUMNS,
            virtualRow.index * COLUMNS + COLUMNS,
          );
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              className="absolute top-0 left-0 w-full grid grid-cols-4 gap-3"
              style={{
                height: `${String(virtualRow.size)}px`,
                transform: `translateY(${String(virtualRow.start)}px)`,
              }}
            >
              {rowItems.map((item) => (
                <PosterCard key={item.id} {...item} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
