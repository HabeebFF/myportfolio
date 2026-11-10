import type { Config } from 'tailwindcss';

/**
 * Design tokens. Change the palette here and it updates everywhere.
 * The same values are mirrored as CSS variables in src/app/globals.css
 * so the canvas animations can read them too.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0B0D', // near black page background
        panel: '#121418', // raised surfaces (cards, console)
        line: '#24272E', // hairline borders
        fg: '#EDEDE6', // off white body text
        muted: '#9BA0A8', // secondary text (AA on bg and panel)
        accent: '#C6FF3D', // acid green, used sparingly
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        hand: ['var(--font-hand)', 'cursive'],
      },
      maxWidth: { site: '76rem' },
    },
  },
  plugins: [],
};

export default config;
