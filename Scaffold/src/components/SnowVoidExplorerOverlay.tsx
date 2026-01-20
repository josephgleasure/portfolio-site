import React, { useEffect, useMemo, useRef } from 'react';

type Props = {
  open: boolean;
  seed: number;
  onClose: () => void;
};

type SnowParticle = {
  x: number;
  y: number;
  z: number;
  speed: number;
  size: number;
  a: number;
};

type CrossParticle = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  arm: 'h' | 'v';
};

const mulberry32 = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export default function SnowVoidExplorerOverlay({ open, seed, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera state lives in refs so we don’t re-render at 60fps
  // Orbit-only camera: fixed radius (no zoom), drag rotates yaw/pitch around origin.
  const camRef = useRef({ yaw: 0.45, pitch: -0.25, radius: 980 });
  const dragRef = useRef<{ active: boolean; sx: number; sy: number; yaw: number; pitch: number }>({
    active: false,
    sx: 0,
    sy: 0,
    yaw: 0,
    pitch: 0,
  });

  const { snow, cross } = useMemo(() => {
    const rand = mulberry32(seed >>> 0);

    // Snow field: stored in world coords, respawned around current camera viewport
    const snowCount = 2600;
    const snow: SnowParticle[] = [];
    for (let i = 0; i < snowCount; i++) {
      snow.push({
        x: (rand() - 0.5) * 2600,
        y: (rand() - 0.5) * 2200,
        z: (rand() - 0.5) * 2600,
        speed: 140 + rand() * 420,
        size: 1.0 + rand() * 2.2,
        a: 0.35 + rand() * 0.55,
      });
    }

    // Cross particles (InfinityCross vibe): cross in the void, floating/bouncing in arms
    const CROSS_COUNT = 5200;
    const ARM_LENGTH = 1100;
    const THICKNESS = 110;
    const DEPTH = 90;
    const groundY = -420;
    const crossCenterY = groundY + ARM_LENGTH / 2;
    const cross: CrossParticle[] = [];
    for (let i = 0; i < CROSS_COUNT; i++) {
      const arm: CrossParticle['arm'] = rand() < 0.5 ? 'h' : 'v';
      const x =
        arm === 'h'
          ? (rand() - 0.5) * ARM_LENGTH
          : (rand() - 0.5) * THICKNESS;
      const y =
        arm === 'h'
          ? crossCenterY + (rand() - 0.5) * THICKNESS
          : groundY + rand() * ARM_LENGTH;
      const z = (rand() - 0.5) * DEPTH;
      const vx = (rand() - 0.5) * (arm === 'h' ? 360 : 180);
      const vy = (rand() - 0.5) * (arm === 'v' ? 360 : 180);
      const vz = (rand() - 0.5) * 140;
      cross.push({ x, y, z, vx, vy, vz, arm });
    }

    return {
      snow,
      cross,
      constants: { ARM_LENGTH, THICKNESS, DEPTH },
    };
  }, [seed]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKeyDown, { capture: true });
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
    const dpr = Math.max(1, Math.min(1.75, window.devicePixelRatio || 1));
    let lastT = 0;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (t: number) => {
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const { yaw, pitch, radius } = camRef.current;

      // Camera basis (lookAt origin)
      const camPos = {
        x: Math.sin(yaw) * Math.cos(pitch) * radius,
        y: Math.sin(pitch) * radius,
        z: Math.cos(yaw) * Math.cos(pitch) * radius,
      };
      const forward = (() => {
        const fx = -camPos.x;
        const fy = -camPos.y;
        const fz = -camPos.z;
        const inv = 1 / Math.max(1e-6, Math.hypot(fx, fy, fz));
        return { x: fx * inv, y: fy * inv, z: fz * inv };
      })();
      const upWorld = { x: 0, y: 1, z: 0 };
      const right = (() => {
        // right = normalize(forward x upWorld)
        const rx = forward.y * upWorld.z - forward.z * upWorld.y;
        const ry = forward.z * upWorld.x - forward.x * upWorld.z;
        const rz = forward.x * upWorld.y - forward.y * upWorld.x;
        const inv = 1 / Math.max(1e-6, Math.hypot(rx, ry, rz));
        return { x: rx * inv, y: ry * inv, z: rz * inv };
      })();
      const up = (() => {
        // up = right x forward
        return {
          x: right.y * forward.z - right.z * forward.y,
          y: right.z * forward.x - right.x * forward.z,
          z: right.x * forward.y - right.y * forward.x,
        };
      })();

      const project = (wx: number, wy: number, wz: number) => {
        const dx = wx - camPos.x;
        const dy = wy - camPos.y;
        const dz = wz - camPos.z;
        const x = dx * right.x + dy * right.y + dz * right.z;
        const y = dx * up.x + dy * up.y + dz * up.z;
        const z = dx * forward.x + dy * forward.y + dz * forward.z;
        // Perspective
        const f = 820;
        const zClamped = Math.max(1, z);
        return { sx: (x / zClamped) * f + w / 2, sy: (-y / zClamped) * f + h / 2, z };
      };

      // background
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#060607';
      ctx.fillRect(0, 0, w, h);

      // Ground plane ("snow horizon") — a large quad at fixed world Y, filled with a soft gradient.
      // Cross will be positioned so its bottom touches this plane.
      const ARM_LENGTH = 1100;
      const THICKNESS = 110;
      const DEPTH = 90;
      const halfArm = ARM_LENGTH / 2;
      const halfThick = THICKNESS / 2;
      const halfDepth = DEPTH / 2;
      const groundY = -420; // tweakable: lower means more "horizon"
      const crossCenterY = groundY + halfArm;

      {
        const S = 5200; // size of ground quad in world units
        const p0 = project(-S, groundY, -S);
        const p1 = project(S, groundY, -S);
        const p2 = project(S, groundY, S);
        const p3 = project(-S, groundY, S);

        // Only draw if a meaningful portion is in front of camera
        if (p0.z > 2 || p1.z > 2 || p2.z > 2 || p3.z > 2) {
          // Find vertical extent for gradient
          const ys = [p0.sy, p1.sy, p2.sy, p3.sy];
          const yTop = Math.min(...ys);
          const yBot = Math.max(...ys);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.lineTo(p2.sx, p2.sy);
          ctx.lineTo(p3.sx, p3.sy);
          ctx.closePath();
          ctx.clip();

          const g = ctx.createLinearGradient(0, yTop, 0, yBot);
          // more opaque near bottom to suggest "snow field"
          g.addColorStop(0.0, 'rgba(255,255,255,0.02)');
          g.addColorStop(0.55, 'rgba(255,255,255,0.06)');
          g.addColorStop(1.0, 'rgba(255,255,255,0.10)');
          ctx.fillStyle = g;
          ctx.fillRect(0, yTop - 10, w, (yBot - yTop) + 20);

          // subtle stipple on the plane (cheap "snow texture")
          const rand = mulberry32((seed ^ 0x5f3759df) >>> 0);
          const dotCount = 420;
          ctx.fillStyle = 'rgba(255,255,255,0.08)';
          for (let i = 0; i < dotCount; i++) {
            const u = rand();
            const v = rand();
            // interpolate in the quad in screen space (good enough for texture)
            const ax = p0.sx + (p1.sx - p0.sx) * u;
            const ay = p0.sy + (p1.sy - p0.sy) * u;
            const bx = p3.sx + (p2.sx - p3.sx) * u;
            const by = p3.sy + (p2.sy - p3.sy) * u;
            const x = ax + (bx - ax) * v;
            const y = ay + (by - ay) * v;
            const s = 1 + rand() * 2;
            ctx.fillRect(x, y, s, s);
          }

          ctx.restore();
        }
      }

      // snow: wrap inside a big cube around the origin (void)
      const cube = 3200;
      for (const p of snow) {
        // fall along -y (downwards)
        p.y -= p.speed * dt;
        // mild wind swirl (depends on depth)
        p.x += Math.sin(t * 0.0003 + p.z * 0.002) * 22 * dt;

        if (p.y < -cube / 2) p.y = cube / 2;
        if (p.y > cube / 2) p.y = -cube / 2;
        if (p.x < -cube / 2) p.x = cube / 2;
        if (p.x > cube / 2) p.x = -cube / 2;
        if (p.z < -cube / 2) p.z = cube / 2;
        if (p.z > cube / 2) p.z = -cube / 2;
        // disappear into the "snowfield" and respawn above
        if (p.y < groundY) p.y = cube / 2;

        const pr = project(p.x, p.y, p.z);
        if (pr.z <= 2) continue;
        if (pr.sx < -20 || pr.sx > w + 20 || pr.sy < -20 || pr.sy > h + 20) continue;
        const size = p.size * (1.0 + 0.6 * Math.min(1, 600 / pr.z));
        ctx.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx.fillRect(pr.sx, pr.sy, size, size);
      }

      // Cross particle field at origin (infinite-cross vibe)
      ctx.fillStyle = 'rgba(255,255,255,0.98)';
      for (const cp of cross) {
        cp.x += cp.vx * dt;
        cp.y += cp.vy * dt;
        cp.z += cp.vz * dt;

        if (cp.arm === 'h') {
          if (Math.abs(cp.x) > halfArm) {
            cp.vx *= -1;
            cp.x = Math.sign(cp.x) * halfArm;
          }
          // horizontal arm is centered around crossCenterY with thickness
          if (cp.y < crossCenterY - halfThick || cp.y > crossCenterY + halfThick) {
            cp.vy *= -1;
            cp.y = Math.max(crossCenterY - halfThick, Math.min(crossCenterY + halfThick, cp.y));
          }
          if (Math.abs(cp.z) > halfDepth) {
            cp.vz *= -1;
            cp.z = Math.sign(cp.z) * halfDepth;
          }
        } else {
          // vertical arm spans [groundY .. groundY + ARM_LENGTH]
          if (cp.y < groundY || cp.y > groundY + ARM_LENGTH) {
            cp.vy *= -1;
            cp.y = Math.max(groundY, Math.min(groundY + ARM_LENGTH, cp.y));
          }
          if (Math.abs(cp.x) > halfThick) {
            cp.vx *= -1;
            cp.x = Math.sign(cp.x) * halfThick;
          }
          if (Math.abs(cp.z) > halfDepth) {
            cp.vz *= -1;
            cp.z = Math.sign(cp.z) * halfDepth;
          }
        }

        const pr = project(cp.x, cp.y, cp.z);
        if (pr.z <= 2) continue;
        if (pr.sx < -20 || pr.sx > w + 20 || pr.sy < -20 || pr.sy > h + 20) continue;
        // Brighter + slightly larger
        const s = 1.15 + 0.8 * Math.min(1, 520 / pr.z);
        ctx.fillRect(pr.sx, pr.sy, s, s);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [open, seed, snow, cross]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="snow-void-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Snow void explorer"
      tabIndex={-1}
      onPointerDown={(e) => {
        // click-and-drag orbit camera
        dragRef.current.active = true;
        dragRef.current.sx = e.clientX;
        dragRef.current.sy = e.clientY;
        dragRef.current.yaw = camRef.current.yaw;
        dragRef.current.pitch = camRef.current.pitch;
      }}
      onPointerMove={(e) => {
        if (!dragRef.current.active) return;
        const dx = e.clientX - dragRef.current.sx;
        const dy = e.clientY - dragRef.current.sy;
        const nextYaw = dragRef.current.yaw + dx * 0.006;
        const nextPitch = dragRef.current.pitch + dy * 0.006;
        camRef.current.yaw = nextYaw;
        camRef.current.pitch = Math.max(-1.2, Math.min(1.2, nextPitch));
      }}
      onPointerUp={() => {
        dragRef.current.active = false;
      }}
      onPointerCancel={() => {
        dragRef.current.active = false;
      }}
    >
      <canvas ref={canvasRef} className="snow-void-canvas" />
    </div>
  );
}

