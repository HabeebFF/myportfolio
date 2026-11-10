'use client';

/**
 * App wide client behaviour:
 *  - MotionConfig makes every Framer Motion animation respect the
 *    visitor's reduced motion setting automatically.
 *  - Lenis adds smooth, inertia based scrolling (skipped for reduced motion
 *    and touch devices, where native scrolling feels better).
 *  - The custom cursor (only on mouse and trackpad devices).
 */
import { MotionConfig } from 'framer-motion';
import { useEffect } from 'react';
import Cursor from './Cursor';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return;

    let lenis: import('lenis').default | undefined;
    let raf = 0;
    let cancelled = false;

    // Loaded lazily so it never delays first paint.
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({ lerp: 0.11, anchors: { offset: -72 } });
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <Cursor />
      {children}
    </MotionConfig>
  );
}
