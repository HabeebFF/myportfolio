'use client';

/**
 * Hero background: a quiet backend diagram drawn on <canvas>.
 * Service nodes (Client, API, Postgres, Redis...) are joined by lines,
 * and small packets travel along them like requests and responses.
 *
 * Performance notes:
 *  - Pauses when scrolled out of view or when the tab is hidden.
 *  - Device pixel ratio is capped at 2.
 *  - With reduced motion, a single static frame is drawn.
 */
import { useEffect, useRef } from 'react';

type Node = { label: string; x: number; y: number; r: number };
type Packet = { edge: number; t: number; speed: number; back: boolean };

// Positions are fractions of the canvas. Kept mostly to the right and
// edges of the screen so they sit behind, not on top of, the headline.
const NODES: Omit<Node, 'r'>[] = [
  { label: 'client', x: 0.08, y: 0.18 },
  { label: 'cdn', x: 0.3, y: 0.08 },
  { label: 'api', x: 0.66, y: 0.26 },
  { label: 'auth', x: 0.86, y: 0.12 },
  { label: 'postgres', x: 0.9, y: 0.5 },
  { label: 'redis', x: 0.74, y: 0.62 },
  { label: 'celery', x: 0.56, y: 0.86 },
  { label: 's3', x: 0.92, y: 0.88 },
  { label: 'mysql', x: 0.22, y: 0.92 },
  { label: 'worker', x: 0.04, y: 0.66 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 2], [2, 3], [2, 4], [2, 5], [5, 6], [6, 4], [6, 7], [6, 8], [8, 9], [9, 0], [3, 4],
];

export default function NodeBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let last = performance.now();

    const packets: Packet[] = Array.from({ length: 14 }, (_, i) => ({
      edge: i % EDGES.length,
      t: Math.random(),
      speed: 0.08 + Math.random() * 0.12,
      back: Math.random() > 0.5,
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const small = w < 640;
      nodes = NODES.map((n) => ({ ...n, x: n.x * w, y: n.y * h, r: small ? 2.5 : 3.5 }));
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);

      // Edges
      ctx.lineWidth = 1;
      for (const [a, b] of EDGES) {
        const A = nodes[a];
        const B = nodes[b];
        const grad = ctx.createLinearGradient(A.x, A.y, B.x, B.y);
        grad.addColorStop(0, 'rgba(237,237,230,0.09)');
        grad.addColorStop(1, 'rgba(237,237,230,0.03)');
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
      }

      // Packets (requests and responses) with a short trail
      for (const p of packets) {
        const [a, b] = EDGES[p.edge];
        const A = p.back ? nodes[b] : nodes[a];
        const B = p.back ? nodes[a] : nodes[b];
        for (let k = 0; k < 6; k++) {
          const tt = Math.max(0, p.t - k * 0.018);
          const x = A.x + (B.x - A.x) * tt;
          const y = A.y + (B.y - A.y) * tt;
          ctx.fillStyle = `rgba(198,255,61,${0.75 * (1 - k / 6)})`;
          ctx.beginPath();
          ctx.arc(x, y, k === 0 ? 1.8 : 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Nodes with a soft pulse and a mono label
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
      nodes.forEach((n, i) => {
        const pulse = reduce ? 0 : (Math.sin(time / 900 + i) + 1) / 2;
        ctx.fillStyle = `rgba(198,255,61,${0.05 + pulse * 0.06})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(237,237,230,0.5)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
        if (w >= 640) {
          ctx.fillStyle = 'rgba(155,160,168,0.45)';
          ctx.fillText(n.label, n.x + 10, n.y - 8);
        }
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (const p of packets) {
        p.t += p.speed * dt;
        if (p.t >= 1) {
          // Arrived: hop to a new edge, sometimes reply back down the same line.
          p.t = 0;
          p.back = Math.random() > 0.5;
          p.edge = Math.floor(Math.random() * EDGES.length);
          p.speed = 0.08 + Math.random() * 0.12;
        }
      }
      draw(now);
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(0);
    // Let the page finish its first render before the animation loop starts.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 300));
    idle(() => start());

    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        start();
      } else {
        stop();
      }
    });
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
