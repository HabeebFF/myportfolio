'use client';

/**
 * The API console: a small terminal styled like an API client.
 * Visitors type a command (or tap a shortcut chip) and get a styled
 * "response". All answers come from src/content.ts.
 *
 * To add a command: add an entry to COMMANDS below.
 */
import { useEffect, useRef, useState } from 'react';
import { profile, projects, skillGroups, experience } from '@/content';
import Reveal from './Reveal';

type Entry = { id: number; cmd: string; status: number; ms: number; body: React.ReactNode };

/** Opens a project's case study (handled in Projects.tsx). */
export const openProject = (id: string) => window.dispatchEvent(new CustomEvent('open-project', { detail: id }));

const COMMANDS: Record<string, { help: string; run: () => { status?: number; body: React.ReactNode } }> = {
  whoami: {
    help: 'Who I am, in one response',
    run: () => ({
      body: (
        <Json
          data={{
            name: profile.name,
            role: profile.role,
            location: profile.location,
            relocation: true,
            status: 'open_to_work',
            summary: profile.positioning,
          }}
        />
      ),
    }),
  },
  projects: {
    help: 'Featured work, with case studies',
    run: () => ({
      body: (
        <ul className="space-y-3">
          {projects.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => openProject(p.id)} className="group text-left">
                <span className="text-accent underline-offset-4 group-hover:underline">{p.name}</span>
                <span className="text-muted"> ({p.status})</span>
                <span className="block text-fg/80">{p.tagline}</span>
                <span className="block text-muted">[{p.stack.slice(0, 5).join(', ')}]  open case study ↗</span>
              </button>
            </li>
          ))}
        </ul>
      ),
    }),
  },
  skills: {
    help: 'What I work with',
    run: () => ({
      body: (
        <ul className="space-y-1">
          {skillGroups.map((g) => (
            <li key={g.id}>
              <span className="text-[#7AA2F7]">{g.name.toLowerCase().replace(/\s/g, '')}</span>
              <span className="text-muted">: </span>
              <span className="text-fg/90">{g.skills.join(', ')}</span>
            </li>
          ))}
        </ul>
      ),
    }),
  },
  experience: {
    help: 'Where I have worked',
    run: () => ({
      body: (
        <ul className="space-y-1">
          {experience.map((j) => (
            <li key={j.company}>
              <span className="text-accent">{j.role}</span> <span className="text-fg/90">@ {j.company}</span>{' '}
              <span className="text-muted">({j.period})</span>
            </li>
          ))}
        </ul>
      ),
    }),
  },
  contact: {
    help: 'How to reach me',
    run: () => ({
      body: (
        <ul className="space-y-1">
          <li>
            <span className="text-muted">email:    </span>
            <a className="text-accent underline-offset-4 hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <span className="text-muted">linkedin: </span>
            <a className="text-accent underline-offset-4 hover:underline" href={profile.links.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/habeeb-mufutau</a>
          </li>
          <li>
            <span className="text-muted">github:   </span>
            <a className="text-accent underline-offset-4 hover:underline" href={profile.links.github} target="_blank" rel="noreferrer">github.com/HabeebFF</a>
          </li>
        </ul>
      ),
    }),
  },
  cv: {
    help: 'Download my CV (PDF)',
    run: () => {
      // Start the download straight away, and leave a link in case it is blocked.
      const a = document.createElement('a');
      a.href = profile.cv;
      a.download = '';
      a.click();
      return {
        body: (
          <p>
            Download started.{' '}
            <a className="text-accent underline-offset-4 hover:underline" href={profile.cv} download>
              Click here if it didn&apos;t.
            </a>
          </p>
        ),
      };
    },
  },
  help: {
    help: 'List commands',
    run: () => ({
      body: (
        <ul className="space-y-0.5">
          {Object.entries(COMMANDS).map(([k, v]) => (
            <li key={k}>
              <span className="inline-block w-28 text-accent">{k}</span>
              <span className="text-muted">{v.help}</span>
            </li>
          ))}
        </ul>
      ),
    }),
  },
  clear: { help: 'Clear the screen', run: () => ({ body: null }) },
};

// Commands that work but aren't listed in `help`.
const HIDDEN: Record<string, () => { status: number; body: React.ReactNode }> = {
  'sudo hire habeeb': () => ({
    status: 201,
    body: (
      <p>
        Permission granted. Offer created.{' '}
        <a
          className="text-accent underline-offset-4 hover:underline"
          href={`mailto:${profile.email}?subject=${encodeURIComponent("Let's talk about a backend role")}`}
        >
          Send it to me
        </a>{' '}
        and I&apos;ll reply.
      </p>
    ),
  }),
  'hire habeeb': () => ({ status: 403, body: <p>Forbidden. Try with sudo.</p> }),
  ls: () => COMMANDS.help.run() as { status: number; body: React.ReactNode },
  hello: () => ({ status: 200, body: <p>Hello! Type <span className="text-accent">help</span> to see what I can answer.</p> }),
};
HIDDEN.hi = HIDDEN.hello;

const SHORTCUTS = ['whoami', 'projects', 'skills', 'experience', 'contact', 'cv', 'help'];
const ALL = [...Object.keys(COMMANDS), ...Object.keys(HIDDEN)];

export default function ApiConsole() {
  const [log, setLog] = useState<Entry[]>([]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest response in view inside the console (never scrolls the page).
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const run = (raw: string) => {
    const cmd = raw.trim().replace(/^\/+/, '').replace(/^(get|GET)\s+\/?/, '').toLowerCase();
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 30));
    setHIndex(-1);
    setValue('');

    if (cmd === 'clear') {
      setLog([]);
      return;
    }

    let res: { status?: number; body: React.ReactNode };
    if (COMMANDS[cmd]) res = COMMANDS[cmd].run();
    else if (HIDDEN[cmd]) res = HIDDEN[cmd]();
    else {
      const guess = ALL.find((c) => c.startsWith(cmd[0]));
      res = {
        status: 404,
        body: (
          <p>
            No route for <span className="text-fg">/{cmd}</span>.{' '}
            {guess ? (
              <>
                Did you mean <CmdButton cmd={guess} onRun={run} />?{' '}
              </>
            ) : null}
            Try <CmdButton cmd="help" onRun={run} />.
          </p>
        ),
      };
    }
    const entry: Entry = { id: ++idRef.current, cmd, status: res.status ?? 200, ms: 6 + Math.floor(Math.random() * 30), body: res.body };
    setLog((l) => [...l, entry].slice(-20));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(history.length - 1, hIndex + 1);
      if (history[i]) {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = hIndex - 1;
      setHIndex(Math.max(-1, i));
      setValue(i >= 0 ? history[i] : '');
    } else if (e.key === 'Tab' && value.trim()) {
      // Tab completes a command. With an empty input, Tab moves focus as normal.
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(value.trim().toLowerCase()));
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    }
  };

  return (
    <section id="console" aria-labelledby="console-title" className="section">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-center">
        <Reveal>
          <p className="eyebrow">/ query me</p>
          <h2 id="console-title" className="h-section mt-4">
            Short on time?
            <br />
            Call the API.
          </h2>
          <p className="mt-6 max-w-md text-lg text-muted">
            This console answers the questions recruiters usually ask. Type a command, or tap one of the shortcuts if you&apos;d rather not type.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_0_0_1px_rgba(198,255,61,0.04),0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            {/* Window bar */}
            <div className="flex items-center gap-2 border-b border-line px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
              <span className="ml-3 font-mono text-xs text-muted">habeeb-api / v1</span>
              <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" /> online
              </span>
            </div>

            {/* Shortcut chips */}
            <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3" role="group" aria-label="Console shortcuts">
              {SHORTCUTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => run(c)}
                  className="rounded-md border border-line bg-bg px-2.5 py-1 font-mono text-xs text-fg/90 transition-colors hover:border-accent hover:text-accent"
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Output */}
            <div
              ref={scrollRef}
              className="thin-scroll h-[22rem] overflow-y-auto px-4 py-4 font-mono text-[13px] leading-relaxed sm:h-[24rem]"
              aria-live="polite"
              onClick={() => inputRef.current?.focus({ preventScroll: true })}
            >
              <p className="text-muted">
                Welcome. Try <CmdButton cmd="whoami" onRun={run} /> or <CmdButton cmd="help" onRun={run} />.
              </p>
              {log.map((e) => (
                <div key={e.id} className="mt-4">
                  <p>
                    <span className="text-[#7AA2F7]">GET</span> <span className="text-fg">/{e.cmd.replace(/\s+/g, '-')}</span>
                  </p>
                  <p className="mb-1.5 text-xs">
                    <span className={e.status < 300 ? 'text-accent' : 'text-[#ff8a80]'}>
                      {e.status} {STATUS[e.status] ?? ''}
                    </span>
                    <span className="text-muted"> · {e.ms}ms</span>
                  </p>
                  <div className="border-l border-line pl-3 text-fg/90">{e.body}</div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              className="flex items-center gap-2 border-t border-line px-4 py-3 font-mono text-sm"
              onSubmit={(e) => {
                e.preventDefault();
                run(value);
              }}
            >
              <label htmlFor="console-input" className="shrink-0 text-accent">
                GET /
              </label>
              <input
                id="console-input"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="type a command, e.g. whoami"
                aria-describedby="console-hint"
                className="min-w-0 flex-1 bg-transparent text-fg placeholder:text-muted/70 focus:outline-none"
              />
              <button type="submit" className="rounded-md bg-accent px-3 py-1 text-xs font-medium text-bg">
                Send
              </button>
            </form>
            <p id="console-hint" className="sr-only">
              Commands: {Object.keys(COMMANDS).join(', ')}. Use the up arrow for history and Tab to complete.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const STATUS: Record<number, string> = { 200: 'OK', 201: 'Created', 403: 'Forbidden', 404: 'Not Found' };

function CmdButton({ cmd, onRun }: { cmd: string; onRun: (c: string) => void }) {
  return (
    <button type="button" onClick={() => onRun(cmd)} className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">
      {cmd}
    </button>
  );
}

/** Renders a small object as syntax highlighted JSON. */
function Json({ data }: { data: Record<string, string | number | boolean> }) {
  const entries = Object.entries(data);
  return (
    <div>
      <span className="text-muted">{'{'}</span>
      {entries.map(([k, v], i) => (
        <div key={k} className="pl-4">
          <span className="text-[#7AA2F7]">&quot;{k}&quot;</span>
          <span className="text-muted">: </span>
          <span className={typeof v === 'string' ? 'text-accent' : 'text-[#ffb86c]'}>{typeof v === 'string' ? `"${v}"` : String(v)}</span>
          {i < entries.length - 1 && <span className="text-muted">,</span>}
        </div>
      ))}
      <span className="text-muted">{'}'}</span>
    </div>
  );
}
