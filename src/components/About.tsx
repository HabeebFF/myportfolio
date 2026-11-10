'use client';

/**
 * About + journey timeline.
 * Early steps ("paper" era) sit on ruled notebook paper with a handwritten
 * snippet. Later steps ("system" era) switch to a terminal look.
 * A green progress line fills as you scroll through the timeline.
 */
import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { about, timeline, type TimelineItem } from '@/content';
import Reveal from './Reveal';

export default function About() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container-site grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow">/ about</p>
            <h2 id="about-title" className="h-section mt-4">
              {about.heading}
            </h2>
            {about.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="mt-6 max-w-xl text-lg leading-relaxed text-fg/80">
                {p}
              </p>
            ))}
          </Reveal>
        </div>

        <div className="relative">
          {/* Track and animated progress line */}
          <div aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 w-px bg-line" />
          <motion.div aria-hidden="true" style={{ scaleY: progress }} className="absolute bottom-2 left-[11px] top-2 w-px origin-top bg-accent" />

          <ol ref={listRef} className="space-y-6">
            {timeline.map((item, i) => (
              <Reveal as="li" key={item.title} delay={0.05} className="relative pl-10">
                <span
                  aria-hidden="true"
                  className={`absolute left-[5px] top-6 h-[13px] w-[13px] rounded-full border-2 ${
                    item.era === 'system' ? 'border-accent bg-bg' : 'border-fg/50 bg-bg'
                  }`}
                />
                {i > 0 && timeline[i - 1].era === 'paper' && item.era === 'system' && (
                  <p aria-hidden="true" className="-mt-1 mb-4 font-mono text-xs text-accent">
                    {'>>> '}notebook closed. terminal opened.
                  </p>
                )}
                <Card item={item} />
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Card({ item }: { item: TimelineItem }) {
  const paper = item.era === 'paper';
  return (
    <article className={`overflow-hidden rounded-xl border border-line p-5 sm:p-6 ${paper ? 'paper pl-12 sm:pl-14' : 'grid-dots'}`}>
      <p className={`font-mono text-xs uppercase tracking-widest ${paper ? 'text-muted' : 'text-accent'}`}>{item.when}</p>
      <h3 className={`mt-2 text-xl font-semibold sm:text-2xl ${paper ? 'font-display' : 'font-display'}`}>{item.title}</h3>
      <p className="mt-2 text-fg/75">{item.body}</p>
      {paper ? (
        <pre aria-hidden="true" className="mt-4 -rotate-1 whitespace-pre-wrap font-hand text-2xl leading-[1.6rem] text-[#a9c7ff]">
          {item.snippet}
        </pre>
      ) : (
        <pre aria-hidden="true" className="mt-4 whitespace-pre-wrap rounded-md border border-line bg-bg/80 px-3 py-2 font-mono text-xs text-accent">
          {item.snippet}
        </pre>
      )}
    </article>
  );
}
