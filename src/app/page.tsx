/**
 * The single page. Sections are in reading order; reorder or remove
 * them here. All text comes from src/content.ts.
 */
import Providers from '@/components/Providers';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import ApiConsole from '@/components/ApiConsole';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import { profile } from '@/content';

export default function Home() {
  return (
    <Providers>
      <div className="grain">
        <Nav />
        <main id="main">
          <Hero />
          <ApiConsole />
          <About />
          <Projects />
          <Experience />
          <Skills />
          <Contact />
        </main>
        <footer className="border-t border-line">
          <div className="container-site flex flex-col gap-3 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {profile.name}. Built with Next.js, deployed on Vercel.
            </p>
            <p>
              <span className="text-accent">200 OK</span> · all systems operational
            </p>
          </div>
        </footer>
      </div>
    </Providers>
  );
}
