'use client';

/**
 * Hero.
 * 1. A line of code types itself: const engineer = "Habeeb Mufutau";
 * 2. At the same time each letter of the big name cycles through random
 *    glyphs and locks into place left to right, like code compiling.
 * 3. Role, positioning line and CTAs fade in underneath.
 *
 * Click or press any key to skip. Reduced motion shows the final state.
 * The real name is always in the HTML (good for SEO and screen readers).
 */
import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { profile } from '@/content';
import NodeBackground from './NodeBackground';
import Magnetic from './Magnetic';

const CODE = `const engineer = "${profile.name}";`;
const GLYPHS = '01{}[]<>/\\=+*#$%&_;:ABCDEFXYZ';
const TYPE_MS = 26; // per character of the code line
const LOCK_START = 260; // when the first name letter locks
const LOCK_STEP = 70; // gap between letters locking

const rand = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

export default function Hero() {
  const reduce = useReducedMotion();
  const letters = useRef([...profile.firstName, ' ', ...profile.lastName]).current;

  // Start in the "unresolved" state so the server HTML and first paint
  // match the beginning of the animation (no flash of the final state).
  const [typed, setTyped] = useState(0);
  const [locked, setLocked] = useState(0);
  const [glyphs, setGlyphs] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce === null) return; // not known yet on the first client render
    if (reduce) {
      setTyped(CODE.length);
      setLocked(letters.length);
      setDone(true);
      return;
    }
    const start = performance.now();
    let raf = 0;
    let lastGlyph = 0;

    const skip = () => {
      cancelAnimationFrame(raf);
      setTyped(CODE.length);
      setLocked(letters.length);
      setDone(true);
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });

    const frame = (now: number) => {
      const t = now - start;
      const nextTyped = Math.min(CODE.length, Math.floor(t / TYPE_MS));
      const nextLocked = Math.max(0, Math.min(letters.length, Math.floor((t - LOCK_START) / LOCK_STEP)));
      setTyped(nextTyped);
      setLocked(nextLocked);
      if (now - lastGlyph > 55) {
        lastGlyph = now;
        setGlyphs(letters.map(rand));
      }
      if (nextTyped < CODE.length || nextLocked < letters.length) {
        raf = requestAnimationFrame(frame);
      } else {
        setDone(true);
        cleanup();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [reduce, letters]);

  // Fade in the rest once the name has resolved.
  const after = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: done ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="top" aria-labelledby="hero-name" className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-16">
      <NodeBackground />
      {/* Vignette keeps the text area calm and readable over the animation. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(10,11,13,0.92)_0%,rgba(10,11,13,0.6)_45%,rgba(10,11,13,0.2)_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      <div className="container-site relative">
        {/* The code line is decorative, so it is hidden from screen readers. */}
        <p aria-hidden="true" className="mb-6 min-h-[1.5em] font-mono text-xs text-muted sm:text-sm">
          <span className="text-accent">~/habeeb $</span>{' '}
          <Code text={CODE.slice(0, typed)} />
          {done ? <span className="hidden text-muted/70 sm:inline">{'  // 200 OK'}</span> : <span className="caret ml-0.5" />}
        </p>

        <h1
          id="hero-name"
          aria-label={profile.name}
          className="font-display text-[clamp(3.4rem,13vw,10.5rem)] font-extrabold leading-[0.88] tracking-[-0.035em]"
        >
          {letters.map((c, i) =>
            c === ' ' ? (
              <br key={i} />
            ) : (
              <span key={i} aria-hidden="true" className="relative inline-block">
                {/* The real letter always holds its space, so nothing jumps. */}
                <span className={i < locked ? 'transition-colors duration-300' : 'text-transparent'}>{c}</span>
                {i >= locked && (
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-[0.62em] font-medium text-accent">
                    {glyphs[i] ?? c}
                  </span>
                )}
              </span>
            ),
          )}
          <span className="text-accent">.</span>
        </h1>

        <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-fg sm:text-base">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" aria-hidden="true" />
            {profile.role}
          </span>
          <span className="text-muted">{profile.location}</span>
          <span className="text-muted">Django · DRF · PostgreSQL · AWS · Docker</span>
        </p>

        {/* Rendered immediately (not faded in) so it paints fast: this is the
            page's Largest Contentful Paint element on most screens. */}
        <p className="mt-6 max-w-2xl text-xl leading-snug text-fg/90 sm:text-2xl">{profile.positioning}</p>

        <motion.div {...after(0)} className="mt-10 flex flex-wrap gap-3">
          <Magnetic>
            <a href="#work" className="btn-primary" data-cursor="View">
              View my work <span aria-hidden="true">↓</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a href={profile.cv} download className="btn-ghost">
              Download CV <span aria-hidden="true">↗</span>
            </a>
          </Magnetic>
        </motion.div>

        <motion.dl {...after(0.15)} className="mt-16 grid max-w-3xl grid-cols-1 gap-6 border-t border-line pt-6 sm:grid-cols-3">
          {profile.facts.map((f) => (
            <div key={f.label}>
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <span className="block font-display text-3xl font-extrabold text-accent">{f.value}</span>
                <span className="mt-1 block text-sm text-muted">{f.label}</span>
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}

/** Tiny syntax highlighter for the one line of code in the hero. */
function Code({ text }: { text: string }) {
  const parts = text.split(/(const|"[^"]*"?|=|;)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) => {
        const cls = p === 'const' ? 'text-[#7AA2F7]' : p.startsWith('"') ? 'text-accent' : p === '=' || p === ';' ? 'text-muted' : 'text-fg';
        return (
          <span key={i} className={cls}>
            {p}
          </span>
        );
      })}
    </>
  );
}
