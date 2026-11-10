'use client';

/**
 * Top navigation. Becomes solid after you scroll, highlights the section
 * in view, and turns into a full screen menu on small screens.
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { profile } from '@/content';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Track which section is in view for the active link style.
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(`#${e.target.id}`)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    // #top and #console aren't in the menu; observing them clears the highlight there.
    ['#top', '#console', ...LINKS.map((l) => l.href)].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${scrolled || open ? 'border-b border-line bg-bg/80 backdrop-blur-md' : ''}`}>
      <a href="#main" className="sr-only left-4 top-4 z-50 rounded bg-accent px-4 py-2 text-bg focus:not-sr-only focus:absolute">
        Skip to content
      </a>
      <nav aria-label="Main" className="container-site flex h-16 items-center justify-between">
        <a href="#top" className="font-mono text-sm font-medium">
          <span className="text-accent">hm</span>
          <span className="text-muted">@</span>backend<span className="caret ml-1 h-[0.9em] w-[0.45em]" aria-hidden="true" />
          <span className="sr-only">: {profile.name}, back to top</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                aria-current={current === l.href ? 'true' : undefined}
                className={`rounded-full px-3 py-1.5 font-mono text-xs transition-colors hover:text-accent ${current === l.href ? 'text-accent' : 'text-fg/80'}`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="ml-3">
            <a href={profile.cv} download className="rounded-full border border-accent px-4 py-1.5 font-mono text-xs text-accent transition-colors hover:bg-accent hover:text-bg">
              CV ↓
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="font-mono text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'close' : 'menu'}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-16 bg-bg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ul className="container-site flex flex-col gap-2 pt-10">
              {LINKS.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-2 font-display text-5xl font-extrabold tracking-tight">
                    {l.label}
                    <span className="text-accent">.</span>
                  </a>
                </motion.li>
              ))}
              <li className="mt-8">
                <a href={profile.cv} download className="btn-primary">
                  Download CV
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
