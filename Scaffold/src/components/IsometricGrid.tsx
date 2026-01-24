import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GridCell } from './types';

export interface Stamp {
  id: string;
  name: string;
}

interface IsometricGridProps {
  gridCellsData: GridCell[][];
  rowStartingColOffsets: number[];
  hoveredStampId: string | null;
  onStampHover: (id: string | null) => void;
  onHeightCalculated?: (height: number) => void;
  onStampClick: (id: string) => void;
}

const TILE_SIZE = 72; // px
const TILE_GAP = 14; // px

const getStampUrl = (id: string) => {
  // This may 404 if the specific thumbnail doesn't exist; we swap to a real fallback in onError.
  return new URL(`../assets/thumbnails/${id}.jpg`, import.meta.url).href;
};

export const IsometricGrid: React.FC<IsometricGridProps> = ({
  gridCellsData,
  rowStartingColOffsets,
  hoveredStampId,
  onStampHover,
  onHeightCalculated,
  onStampClick
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [visibleHeight, setVisibleHeight] = useState(0);
  const fallbackThumbUrl = useMemo(
    () => new URL(`../assets/projects/fallback.jpg`, import.meta.url).href,
    []
  );

  // Compute the maximum number of columns across rows (including their offsets)
  const maxColumns = useMemo(() => {
    return gridCellsData.reduce((max, row, idx) => {
      const offset = rowStartingColOffsets[idx] || 0;
      return Math.max(max, offset + row.length);
    }, 0);
  }, [gridCellsData, rowStartingColOffsets]);

  // Measure height after render (flat layout)
  useEffect(() => {
    const gridEl = gridRef.current;
    if (!gridEl) return;
    const paddedHeight = gridEl.scrollHeight + 40;
    setVisibleHeight(paddedHeight);
    if (onHeightCalculated) onHeightCalculated(paddedHeight);
  }, [gridCellsData, onHeightCalculated, maxColumns]);

  // No JS stagger needed; animations handled in CSS with reveal classes

  useEffect(() => {
    if (gridRef.current && onHeightCalculated) {
      onHeightCalculated(visibleHeight);
    }
  }, [visibleHeight, onHeightCalculated]);

  return (
    <div ref={gridRef} className="flat-grid" style={{ height: `${visibleHeight}px` }}>
      {gridCellsData.map((row, rowIndex) => {
        const baseOffset = rowStartingColOffsets[rowIndex] || 0;
        const trailingGhosts = Math.max(0, maxColumns - baseOffset - row.length);
        return (
          <div
            key={`row-${rowIndex}`}
            className="grid-row"
            style={{
              gap: `${TILE_GAP}px`,
              marginBottom: `${TILE_GAP}px`
            }}
          >
            {Array.from({ length: baseOffset }).map((_, i) => (
              <div
                key={`ghost-left-${rowIndex}-${i}`}
                className="grid-cell ghost"
                style={{ width: TILE_SIZE, height: TILE_SIZE }}
                aria-hidden="true"
              />
            ))}
            {row.map((cell, colIndex) => {
              const classNames = ['grid-cell'];
              if (!cell.stamp) classNames.push('empty');
              if (cell.stamp?.id === hoveredStampId) classNames.push('highlighted');
              return (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={classNames.join(' ')}
                  style={{ width: TILE_SIZE, height: TILE_SIZE }}
                  onMouseEnter={() => cell.stamp && onStampHover(cell.stamp.id)}
                  onMouseLeave={() => onStampHover(null)}
                  onClick={() => cell.stamp && onStampClick(cell.stamp.id)}
                >
                  {cell.stamp ? (
                    <img
                      src={getStampUrl(cell.stamp.id)}
                      alt={cell.stamp.name}
                      className="thumb"
                      loading="lazy"
                      onLoad={(e) => e.currentTarget.classList.add('loaded')}
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null; // prevent loops
                        img.src = fallbackThumbUrl;
                      }}
                    />
                  ) : (
                    <div className="empty-cell" />
                  )}
                </div>
              );
            })}
            {Array.from({ length: trailingGhosts }).map((_, i) => (
              <div
                key={`ghost-right-${rowIndex}-${i}`}
                className="grid-cell ghost"
                style={{ width: TILE_SIZE, height: TILE_SIZE }}
                aria-hidden="true"
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};