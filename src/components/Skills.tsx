'use client';

/**
 * Skills as an interactive dependency graph (desktop) and grouped clusters (mobile).
 * Python sits at the root; each group in `skillGroups` (content.ts) is a hub,
 * and its skills hang off it like the output of the `tree` command.
 * Hover a column or use the filter buttons to highlight a group.
 */
import { motion } from 'framer-motion';
import { useState } from 'react';
import { skillGroups } from '@/content';
import Reveal from './Reveal';

const W = 1200;
const COL = W / skillGroups.length; // width of each group's column
const ROOT_Y = 46;
const HUB_Y = 170;
const LEAF_Y = 250; // first skill
const STEP = 46; // gap between skills
const maxSkills = Math.max(...skillGroups.map((g) => g.skills.length));
const H = LEAF_Y + (maxSkills - 1) * STEP + 40;

export default function Skills() {
  const [active, setActive] = useState<string | null>(null);
  const dim = (id: string) => active !== null && active !== id;

  return (
    <section id="skills" aria-labelledby="skills-title" className="section overflow-hidden">
      <div className="container-site">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">/ skills</p>
            <h2 id="skills-title" className="h-section mt-4">
              The stack, mapped.
            </h2>
          </div>
          <p className="max-w-sm text-muted">The tools I use in production, grouped the way they connect in a real system.</p>
        </Reveal>

        {/* Filter buttons (desktop graph) */}
        <div className="mt-10 hidden flex-wrap gap-2 md:flex" role="group" aria-label="Highlight a skill group">
          {skillGroups.map((g) => (
            <button
              key={g.id}
              type="button"
              aria-pressed={active === g.id}
              onClick={() => setActive(active === g.id ? null : g.id)}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-colors ${
                active === g.id ? 'border-accent bg-accent text-bg' : 'border-line text-fg/85 hover:border-accent'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Desktop: graph */}
        <Reveal className="relative mt-8 hidden md:block">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden="true">
            {/* Root */}
            <rect x={W / 2 - 92} y={ROOT_Y - 22} width={184} height={44} rx={22} fill="#C6FF3D" />
            <text x={W / 2} y={ROOT_Y + 6} textAnchor="middle" fontSize="16" fontWeight="800" fill="#0A0B0D" fontFamily="var(--font-display)">
              import python
            </text>

            {skillGroups.map((g, gi) => {
              const hx = COL * gi + COL / 2;
              const trunkX = hx - COL / 2 + 34;
              const lastY = LEAF_Y + (g.skills.length - 1) * STEP;
              const on = active === g.id;
              return (
                <g
                  key={g.id}
                  onMouseEnter={() => setActive(g.id)}
                  onMouseLeave={() => setActive(null)}
                  style={{ opacity: dim(g.id) ? 0.18 : 1, transition: 'opacity .35s' }}
                >
                  {/* Invisible hit area for the whole column */}
                  <rect x={COL * gi} y={HUB_Y - 30} width={COL} height={H - HUB_Y + 30} fill="transparent" />

                  {/* Root to hub */}
                  <path
                    d={`M${W / 2},${ROOT_Y + 22} C${W / 2},${(ROOT_Y + HUB_Y) / 2} ${hx},${(ROOT_Y + HUB_Y) / 2 - 10} ${hx},${HUB_Y - 22}`}
                    fill="none"
                    stroke="#C6FF3D"
                    strokeOpacity={on ? 0.9 : 0.4}
                    strokeDasharray="3 6"
                    className="flow"
                  />

                  {/* Hub */}
                  <rect x={hx - COL / 2 + 14} y={HUB_Y - 22} width={COL - 28} height={44} rx={10} fill={on ? '#C6FF3D' : '#0A0B0D'} stroke="#C6FF3D" strokeWidth="1.5" style={{ transition: 'fill .3s' }} />
                  <text x={hx} y={HUB_Y + 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={on ? '#0A0B0D' : '#C6FF3D'} fontFamily="var(--font-sans)">
                    {g.name}
                  </text>

                  {/* Tree trunk */}
                  <motion.line
                    x1={trunkX}
                    y1={HUB_Y + 22}
                    x2={trunkX}
                    y2={lastY}
                    stroke="#2E323A"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 + gi * 0.08 }}
                  />

                  {g.skills.map((s, i) => {
                    const y = LEAF_Y + i * STEP;
                    const w = s.length * 8.4 + 28;
                    return (
                      <motion.g
                        key={s}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + gi * 0.08 + i * 0.05, duration: 0.4 }}
                      >
                        <path d={`M${trunkX},${y} H${trunkX + 16}`} stroke={on ? '#C6FF3D' : '#2E323A'} />
                        <rect x={trunkX + 16} y={y - 15} width={w} height={30} rx={15} fill="#121418" stroke={on ? '#C6FF3D' : '#2E323A'} />
                        <text x={trunkX + 16 + w / 2} y={y + 5} textAnchor="middle" fontSize="14" fill="#EDEDE6" fontFamily="var(--font-mono)">
                          {s}
                        </text>
                      </motion.g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </Reveal>

        {/* Mobile layout, and the accessible version of the graph on desktop */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:sr-only">
          {skillGroups.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.05} className="rounded-xl border border-line bg-panel p-5">
              <h3 className="flex items-center gap-2 font-mono text-sm text-accent">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
                {g.name}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <li key={s} className="chip text-fg/90">
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
