'use client';

/** Experience as an animated vertical timeline. Data: `experience` in content.ts. */
import { motion, useScroll, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { experience } from '@/content';
import Reveal from './Reveal';

export default function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 50%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="experience" aria-labelledby="exp-title" className="section">
      <div className="container-site">
        <Reveal>
          <p className="eyebrow">/ experience</p>
          <h2 id="exp-title" className="h-section mt-4">
            Where I&apos;ve shipped.
          </h2>
        </Reveal>

        <div className="relative mt-16">
          <div aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-[calc(12rem+7px)]" />
          <motion.div aria-hidden="true" style={{ scaleY }} className="absolute bottom-0 left-[7px] top-0 w-px origin-top bg-accent md:left-[calc(12rem+7px)]" />

          <ol ref={ref} className="space-y-14">
            {experience.map((job, i) => (
              <Reveal as="li" key={job.company} delay={i * 0.05} className="relative grid gap-3 pl-10 md:grid-cols-[12rem_1fr] md:gap-12 md:pl-0">
                <p className="font-mono text-sm text-muted md:pt-1 md:text-right md:pr-6">{job.period}</p>
                <span aria-hidden="true" className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-accent bg-bg md:left-[12rem]" />
                <div className="md:pl-10">
                  <h3 className="font-display text-2xl font-extrabold sm:text-3xl">{job.role}</h3>
                  <p className="mt-1 text-lg text-accent">
                    {job.company} <span className="text-muted">· {job.place}</span>
                  </p>
                  <ul className="mt-4 max-w-3xl space-y-2">
                    {job.points.map((pt) => (
                      <li key={pt} className="flex gap-3 leading-relaxed text-fg/80">
                        <span aria-hidden="true" className="font-mono text-accent">›</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
