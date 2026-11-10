'use client';

/**
 * Featured projects as case study cards. Clicking a card opens a
 * full case study dialog with the architecture diagram.
 * The console's `projects` command can open a case study too
 * (it sends an "open-project" event that this component listens for).
 */
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { projects, type Project } from '@/content';
import ArchDiagram from './ArchDiagram';
import Reveal from './Reveal';

export default function Projects() {
  const [open, setOpen] = useState<Project | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const show = useCallback((p: Project) => {
    lastTrigger.current = document.activeElement as HTMLElement | null;
    setOpen(p);
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const p = projects.find((x) => x.id === (e as CustomEvent<string>).detail);
      if (p) show(p);
    };
    window.addEventListener('open-project', onOpen);
    return () => window.removeEventListener('open-project', onOpen);
  }, [show]);

  const close = () => {
    setOpen(null);
    // Return focus to whatever opened the dialog.
    requestAnimationFrame(() => lastTrigger.current?.focus({ preventScroll: true }));
  };

  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">/ selected work</p>
            <h2 id="work-title" className="h-section mt-4">
              Systems in production.
            </h2>
          </div>
          <p className="max-w-sm text-muted">Three projects, each with the problem, what I built, and how the pieces fit together.</p>
        </Reveal>

        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08} className={i === 0 ? 'lg:col-span-2' : ''}>
              <ProjectCard project={p} index={i} featured={i === 0} onOpen={() => show(p)} />
            </Reveal>
          ))}
        </ul>
      </div>

      <AnimatePresence>{open && <CaseStudy key={open.id} project={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}

function ProjectCard({ project: p, index, featured, onOpen }: { project: Project; index: number; featured: boolean; onOpen: () => void }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel transition-colors duration-300 hover:border-accent/50">
      <div className={`grid h-full gap-6 p-6 sm:p-8 ${featured ? 'lg:grid-cols-[1fr_1.1fr] lg:items-center' : ''}`}>
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 font-mono text-xs text-muted">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span className="inline-flex items-center gap-1.5 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {p.status}
            </span>
          </div>
          <h3 className="mt-5 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{p.name}</h3>
          <p className="mt-3 text-lg text-fg/80">{p.tagline}</p>
          <p className="mt-4 text-muted">{p.problem}</p>

          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
            {p.impact.slice(0, 2).map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block font-display text-2xl font-extrabold text-accent">{m.value}</span>
                  <span className="block max-w-[14rem] text-sm text-muted">{m.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
            {p.stack.slice(0, featured ? 9 : 6).map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden rounded-xl border border-line bg-bg/60 p-3 opacity-80 sm:block transition-opacity duration-300 group-hover:opacity-100">
          <ArchDiagram project={p} compact />
        </div>
      </div>

      {/* The whole card is clickable through this button's stretched hit area. */}
      <div className="mt-auto border-t border-line px-6 py-4 sm:px-8">
        <button
          type="button"
          onClick={onOpen}
          data-cursor="Open"
          className="font-mono text-sm text-fg after:absolute after:inset-0 after:content-[''] group-hover:text-accent"
        >
          Read the case study <span aria-hidden="true">→</span>
          <span className="sr-only">: {p.name}</span>
        </button>
      </div>
    </article>
  );
}

function CaseStudy({ project: p, onClose }: { project: Project; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Keep keyboard focus inside the dialog.
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`cs-${p.id}`}
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="thin-scroll relative max-h-[92svh] w-full max-w-5xl overflow-y-auto rounded-t-2xl border border-line bg-bg sm:rounded-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-bg/90 px-6 py-4 backdrop-blur sm:px-10">
          <p className="font-mono text-xs text-muted">case-study / {p.id}</p>
          <button ref={closeRef} type="button" onClick={onClose} className="rounded-full border border-line px-4 py-1.5 font-mono text-xs hover:border-accent hover:text-accent">
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="px-6 pb-12 pt-8 sm:px-10">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            {p.status} · {p.role}
          </p>
          <h2 id={`cs-${p.id}`} className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            {p.name}
          </h2>
          <p className="mt-4 max-w-3xl text-xl text-fg/80">{p.tagline}</p>

          <dl className="mt-8 grid gap-6 border-y border-line py-6 sm:grid-cols-3">
            {p.impact.map((m) => (
              <div key={m.label}>
                <dt className="sr-only">{m.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-extrabold text-accent">{m.value}</span>
                  <span className="block text-sm text-muted">{m.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h3 className="eyebrow">The problem</h3>
              <p className="mt-3 text-lg leading-relaxed text-fg/85">{p.problem}</p>
            </div>
            <div>
              <h3 className="eyebrow">What I built</h3>
              <ul className="mt-3 space-y-3">
                {p.built.map((b) => (
                  <li key={b} className="flex gap-3 leading-relaxed text-fg/85">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="eyebrow mt-12">Architecture</h3>
          <div className="thin-scroll mt-4 overflow-x-auto rounded-xl border border-line bg-panel p-4">
            <div className="min-w-[640px]">
              <ArchDiagram project={p} />
            </div>
          </div>

          <h3 className="eyebrow mt-12">Stack</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="chip text-fg/90">
                {s}
              </li>
            ))}
          </ul>

          {p.links.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3">
              {p.links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn-ghost">
                  {l.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
