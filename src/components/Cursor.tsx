'use client';

/**
 * Custom cursor: a small dot that tracks the pointer exactly, plus a ring
 * that follows with a little lag and grows over links and buttons.
 * Only runs on fine pointers (mouse, trackpad). Touch devices and
 * reduced motion users keep the normal cursor.
 */
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

const INTERACTIVE = 'a, button, [role="button"], [data-cursor], summary, label[for]';

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);
  const [onText, setOnText] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 400, damping: 35, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 400, damping: 35, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add('has-custom-cursor');

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      setHovering(!!el);
      setLabel(el?.dataset.cursor ?? null);
      setOnText(!!(e.target as Element | null)?.closest?.('input, textarea'));
    };
    const leave = () => setHidden(true);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [x, y]);

  if (!enabled) return null;
  const visible = !hidden && !onText;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div
        className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-accent/70 font-mono text-[10px] uppercase tracking-widest text-bg"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: label ? 72 : hovering ? 48 : 28,
          height: label ? 72 : hovering ? 48 : 28,
          backgroundColor: label ? 'rgba(198,255,61,1)' : hovering ? 'rgba(198,255,61,0.12)' : 'rgba(198,255,61,0)',
          opacity: visible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {label}
      </motion.div>
    </div>
  );
}
