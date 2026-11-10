# Habeeb Mufutau, portfolio

Personal portfolio for a Python backend engineer. Dark, cinematic, fast.

Built with **Next.js 15**, **Tailwind CSS** and **Framer Motion**, exported as a fully static site.

Lighthouse (mobile): Performance 93, Accessibility 100, Best Practices 100, SEO 100.
Desktop: 100 across the board.

## Edit your content

Nearly everything you'd want to change is in **`src/content.ts`**: your profile, the about story and timeline, projects (including their architecture diagrams), experience, skills and contact text. Layout components only read from this file.

| Want to change | Where |
| --- | --- |
| Name, role, email, links, hero facts | `profile` in `src/content.ts` |
| Live site URL (SEO and social previews) | `site.url` in `src/content.ts` |
| Add a project | Add an object to `projects`. The diagram is built from its `architecture` nodes and edges |
| Colours | `tailwind.config.ts` and `:root` in `src/app/globals.css` |
| Fonts | `src/app/layout.tsx` |
| Console commands | `COMMANDS` in `src/components/ApiConsole.tsx` |
| CV file | Replace `public/cv/Habeeb_Mufutau_CV.pdf` (keep the name, or update `profile.cv`) |
| Social preview image | `public/og.png` (1200 x 630) |

## Run it locally

You need Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000, hot reload
```

To check the production build:

```bash
npm run build      # writes the static site to /out
npm start          # serves /out on http://localhost:3000
```

## Turn on the contact form (2 minutes, free)

1. Sign up at [formspree.io](https://formspree.io) with your email.
2. Create a new form. Its endpoint looks like `https://formspree.io/f/xyzabcd`.
3. Paste the ID (`xyzabcd`) into `formspreeId` in `src/content.ts`, then commit and push.

Until you do this, the form still works: it opens the visitor's email app with their message filled in.

## Deploy for free

### Vercel (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import the `myportfolio` repository. Vercel detects Next.js; keep the defaults and click **Deploy**.
3. When it is live, copy the URL (for example `https://myportfolio-habeeb.vercel.app`) into `site.url` in `src/content.ts` and push. Every push to `main` redeploys automatically.
4. Optional: add a custom domain under Project, Settings, Domains.

### Netlify

1. Go to [app.netlify.com](https://app.netlify.com), choose **Add new site**, then **Import an existing project**, and pick the repo.
2. Build command: `npm run build`. Publish directory: `out`.
3. Deploy, then update `site.url` as above.

## Project structure

```
src/
  content.ts              all site content (edit this)
  app/
    layout.tsx            fonts, SEO meta tags, Open Graph, structured data
    page.tsx              section order
    globals.css           base styles, paper and grid textures
    robots.ts, sitemap.ts
  components/
    Hero.tsx              self typing name and CTAs
    NodeBackground.tsx    canvas backend diagram behind the hero
    ApiConsole.tsx        the interactive API console
    About.tsx             story and pen to production timeline
    Projects.tsx          case study cards and detail dialog
    ArchDiagram.tsx       SVG architecture diagrams
    Experience.tsx        animated work timeline
    Skills.tsx            interactive skills graph
    Contact.tsx           call to action and contact form
    Nav.tsx, Cursor.tsx, Magnetic.tsx, Reveal.tsx, Providers.tsx
public/
  cv/                     downloadable CV
  og.png, favicon.svg
```

## Accessibility and motion

- All animation respects `prefers-reduced-motion`: the hero shows its final state, the canvas is static, and scroll effects are off.
- The custom cursor only runs on mouse and trackpad devices.
- Everything is keyboard navigable, with a skip link, visible focus rings and a focus trapped case study dialog.
- The skills graph has a text equivalent for screen readers, and each architecture diagram has a written summary.
