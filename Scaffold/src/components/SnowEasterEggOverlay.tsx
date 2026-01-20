import React, { useEffect, useMemo, useRef } from 'react';

type Props = {
  open: boolean;
  seed: number;
  onClose: () => void;
};

type RailRunner = {
  axis: 'h' | 'v';
  lane: number; // row for h, col for v
  phase: number; // phase offset (cells)
  speed: number; // cells/sec
  lenCells: number; // trail length in cells
  size: number; // px (square head)
  weight: number; // stroke width
  a: number;
};

const mulberry32 = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const SnowEasterEggOverlay: React.FC<Props> = ({ open, seed, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const runners = useMemo(() => {
    const rand = mulberry32(seed >>> 0);
    const count = 18;
    const arr: RailRunner[] = [];
    for (let i = 0; i < count; i++) {
      const axis: RailRunner['axis'] = rand() < 0.55 ? 'h' : 'v';
      const dir = rand() < 0.5 ? -1 : 1;
      const weight = rand() < 0.22 ? 2.5 : 1.5;
      arr.push({
        axis,
        lane: Math.floor(rand() * (axis === 'h' ? 6 : 12)),
        phase: rand() * 50,
        speed: dir * (0.22 + rand() * 0.75), // cells/sec
        lenCells: 1 + Math.floor(rand() * 7),
        size: 4 + rand() * 7,
        weight,
        a: 0.22 + rand() * 0.42,
      });
    }
    return arr;
  }, [seed]);

  useEffect(() => {
    if (!open) return;
    // Ensure ESC always works even if focus is inside other elements.
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown, { capture: true });
    // Grab focus so keyboard events reliably hit the page.
    queueMicrotask(() => overlayRef.current?.focus());
    return () => document.removeEventListener('keydown', onKeyDown, { capture: true } as any);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    window.addEventListener('resize', resize);

    const grid = {
      cols: 12,
      rows: 6,
      pad: 44,
    };

    let lastT = 0;
    const draw = (t: number) => {
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Background (slight paper tint)
      ctx.fillStyle = 'rgba(247,247,245,0.94)';
      ctx.fillRect(0, 0, w, h);

      // Swiss grid lines
      const innerW = Math.max(0, w - grid.pad * 2);
      const innerH = Math.max(0, h - grid.pad * 2);
      const cellW = innerW / grid.cols;
      const cellH = innerH / grid.rows;

      // NOTE: Grid is intentionally NOT drawn; motion is still quantized to invisible rails.

      // Blocks (subtle, like printed plates)
      {
        const rand = mulberry32((seed ^ 0xa5a5a5a5) >>> 0);
        const blockCount = 7;
        for (let i = 0; i < blockCount; i++) {
          const c = Math.floor(rand() * grid.cols);
          const r = Math.floor(rand() * grid.rows);
          const bw = 1 + Math.floor(rand() * 2);
          const bh = 1 + Math.floor(rand() * 2);
          const x = grid.pad + c * cellW;
          const y = grid.pad + r * cellH;
          ctx.fillStyle = rand() < 0.15 ? 'rgba(20,20,20,0.06)' : 'rgba(20,20,20,0.03)';
          ctx.fillRect(x + 1, y + 1, bw * cellW - 2, bh * cellH - 2);
        }
      }

      // Animated "runners" that move strictly along grid rails:
      // cell-to-cell motion with easing + a square head + a line "trail"
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      for (const rr of runners) {
        const alpha = rr.a;
        ctx.strokeStyle = `rgba(20,20,20,${alpha})`;
        ctx.fillStyle = `rgba(20,20,20,${alpha})`;
        ctx.lineWidth = rr.weight;

        // quantized motion in "cells"
        const steps = rr.axis === 'h' ? grid.cols : grid.rows;
        const u = rr.phase + (t * 0.001) * rr.speed;
        const i0 = Math.floor(u);
        let frac = u - i0;
        // ease-in-out (smoothstep)
        frac = frac * frac * (3 - 2 * frac);
        let headCell = (i0 % steps) + frac;
        if (headCell < 0) headCell += steps;

        if (rr.axis === 'h') {
          const y = grid.pad + rr.lane * cellH;
          const x1 = grid.pad + headCell * cellW;
          const trail = rr.lenCells * cellW;
          const x0 = x1 - trail;
          // handle wrap by drawing two segments when needed
          ctx.beginPath();
          if (x0 >= grid.pad) {
            ctx.moveTo(x0, y);
            ctx.lineTo(x1, y);
          } else {
            // segment from left edge to x1
            ctx.moveTo(grid.pad, y);
            ctx.lineTo(x1, y);
            // segment from (end - remaining) to right edge
            const rem = grid.pad - x0;
            const xA = grid.pad + innerW - rem;
            ctx.moveTo(xA, y);
            ctx.lineTo(grid.pad + innerW, y);
          }
          ctx.stroke();
          // square head
          ctx.fillRect(x1 - rr.size / 2, y - rr.size / 2, rr.size, rr.size);
        } else {
          const x = grid.pad + rr.lane * cellW;
          const y1 = grid.pad + headCell * cellH;
          const trail = rr.lenCells * cellH;
          const y0 = y1 - trail;
          ctx.beginPath();
          if (y0 >= grid.pad) {
            ctx.moveTo(x, y0);
            ctx.lineTo(x, y1);
          } else {
            ctx.moveTo(x, grid.pad);
            ctx.lineTo(x, y1);
            const rem = grid.pad - y0;
            const yA = grid.pad + innerH - rem;
            ctx.moveTo(x, yA);
            ctx.lineTo(x, grid.pad + innerH);
          }
          ctx.stroke();
          ctx.fillRect(x - rr.size / 2, y1 - rr.size / 2, rr.size, rr.size);
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ro.disconnect();
    };
  }, [open, runners, seed]);

  if (!open) return null;

  return (
    <div
      className="easter-egg-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Snow easter egg"
      ref={overlayRef}
      tabIndex={-1}
    >
      <div className="easter-egg-surface">
        <canvas ref={canvasRef} className="easter-egg-canvas" />
      </div>
    </div>
  );
};

export default SnowEasterEggOverlay;

