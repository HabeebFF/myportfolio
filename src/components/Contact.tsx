'use client';

/**
 * Contact: big call to action, direct links and a working form.
 * The form posts to Formspree (set `formspreeId` in content.ts).
 * Until that is set, submitting opens the visitor's email app with the
 * message filled in, so the form is never a dead end.
 */
import { useState } from 'react';
import { contact, profile } from '@/content';
import Magnetic from './Magnetic';
import Reveal from './Reveal';

type State = 'idle' | 'sending' | 'sent' | 'error';

export default function Contact() {
  const [state, setState] = useState<State>('idle');
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!profile.formspreeId) {
      const subject = `Portfolio enquiry from ${data.get('name')}`;
      const body = `${data.get('message')}\n\n${data.get('name')} (${data.get('email')})`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setState('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${profile.formspreeId}`, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setState('sent');
    } catch {
      setState('error');
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-title" className="section border-t border-line">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(198,255,61,0.10),transparent_65%)]" />
      <div className="container-site relative">
        <Reveal>
          <p className="eyebrow">/ contact</p>
          <h2 id="contact-title" className="mt-4 max-w-5xl font-display text-[clamp(2.75rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
            {contact.heading}
          </h2>
          <p className="mt-8 max-w-2xl text-lg text-fg/80 sm:text-xl">{contact.body}</p>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Email</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <a href={`mailto:${profile.email}`} className="font-display text-[clamp(1.05rem,5.4vw,1.875rem)] font-extrabold hover:text-accent" data-cursor="Write">
                  {profile.email}
                </a>
                <button type="button" onClick={copy} className="chip hover:border-accent hover:text-accent">
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <span className="sr-only" aria-live="polite">
                  {copied ? 'Email address copied' : ''}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn-ghost">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={profile.cv} download className="btn-ghost">
                  CV (PDF) <span aria-hidden="true">↓</span>
                </a>
              </Magnetic>
            </div>
            <p className="font-mono text-sm text-muted">
              <span className="text-accent">●</span> {profile.location}. {profile.availability}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-line bg-panel p-6 sm:p-8" noValidate={false}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" autoComplete="name" />
                <Field label="Email" name="email" type="email" autoComplete="email" />
              </div>
              <div>
                <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-2 w-full resize-y rounded-lg border border-line bg-bg px-4 py-3 text-fg placeholder:text-muted/70 focus:border-accent focus:outline-none"
                  placeholder="The role, the team, the system you're building..."
                />
              </div>
              {/* Honeypot: hidden from people, catches spam bots. */}
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Magnetic>
                  <button type="submit" disabled={state === 'sending'} className="btn-primary disabled:opacity-60">
                    {state === 'sending' ? 'Sending...' : 'Send message'} <span aria-hidden="true">→</span>
                  </button>
                </Magnetic>
                <p role="status" className="font-mono text-sm">
                  {state === 'sent' && <span className="text-accent">201 Created. Thanks, I&apos;ll be in touch.</span>}
                  {state === 'error' && (
                    <span className="text-[#ff8a80]">
                      Something failed. Email me at <a className="underline" href={`mailto:${profile.email}`}>{profile.email}</a>.
                    </span>
                  )}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = 'text', autoComplete }: { label: string; name: string; type?: string; autoComplete?: string }) {
  return (
    <div>
      <label htmlFor={name} className="font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-lg border border-line bg-bg px-4 py-3 text-fg focus:border-accent focus:outline-none"
      />
    </div>
  );
}
