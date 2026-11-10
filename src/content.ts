/**
 * ============================================================
 *  SITE CONTENT
 *  Everything you'd want to edit lives in this one file:
 *  your details, story, projects, jobs, skills and links.
 *  Layout components read from here, so you never need to
 *  touch them to add a project or change a sentence.
 *
 *  House style: concise, concrete, no em dashes.
 * ============================================================
 */

export const site = {
  /** Change this to your real domain once deployed (used for SEO and Open Graph). */
  url: 'https://habeebmufutau.vercel.app',
  title: 'Habeeb Mufutau | Python Backend Engineer',
  description:
    'Python backend engineer in Leeds, UK. Django, DRF, PostgreSQL, MySQL, AWS and Docker. I built and run a production platform used by 9,500+ people.',
};

export const profile = {
  name: 'Habeeb Mufutau',
  firstName: 'Habeeb',
  lastName: 'Mufutau',
  role: 'Python Backend Engineer',
  location: 'Leeds, UK',
  availability: 'Open to backend roles in the UK. Happy to relocate.',
  positioning: 'I build the systems you never see, so the products you do see never break.',
  email: 'habeebmuftau05@gmail.com',
  cv: '/cv/Habeeb_Mufutau_CV.pdf',
  links: {
    github: 'https://github.com/HabeebFF',
    linkedin: 'https://www.linkedin.com/in/habeeb-mufutau',
  },
  /**
   * Contact form. Create a free form at https://formspree.io, then paste
   * the form ID here (the part after /f/ in its endpoint, e.g. "xyzabcd").
   * While this is empty, the form opens the visitor's email app instead.
   */
  formspreeId: '',
  /** Short facts shown under the hero and returned by `whoami` in the console. */
  facts: [
    { value: '9,500+', label: 'users on a backend I built from scratch' },
    { value: '3 yrs', label: 'shipping Django and DRF in production' },
    { value: '2:1', label: 'BSc Applied Computing, University of South Wales' },
  ],
};

/* ------------------------------------------------------------
 *  ABOUT + TIMELINE
 *  `era: 'paper'` items render on a ruled notebook page with a
 *  handwritten note. `era: 'system'` items render as terminal UI.
 * ---------------------------------------------------------- */

export const about = {
  heading: 'From pen and paper to production.',
  paragraphs: [
    'I started with HTML and CSS in secondary school. When I moved on to Python, I didn\'t have regular access to a computer, so I learned from a book and a pen. I wrote programs out by hand and traced every line in my notebook to work out what they would print.',
    'That habit stuck. I still think through the data and the failure cases before I write code. It got me a First Class diploma at NIIT, then a job teaching programming there, then a 2:1 in Applied Computing. Today I build and run backends that thousands of people use every day.',
  ],
};

export type TimelineItem = {
  when: string;
  title: string;
  body: string;
  era: 'paper' | 'system';
  /** A small handwritten (paper) or terminal (system) snippet shown beside the item. */
  snippet: string;
};

export const timeline: TimelineItem[] = [
  {
    when: 'Secondary school',
    title: 'First web pages',
    body: 'Learned HTML and CSS and found out I liked making things that work.',
    era: 'paper',
    snippet: '<h1>hello, world</h1>',
  },
  {
    when: 'Self taught',
    title: 'Python with a book and a pen',
    body: 'Wrote programs by hand and traced them line by line before I had regular computer access.',
    era: 'paper',
    snippet: 'for i in range(3):\n    print(i)  # 0 1 2',
  },
  {
    when: '2022 to 2024',
    title: 'First Class diploma, NIIT Lagos',
    body: 'Professional Diploma in IT, First Class Honours. Python, Java, JavaScript, OOP and algorithms.',
    era: 'paper',
    snippet: 'grade = "First Class"',
  },
  {
    when: '2023 to 2025',
    title: 'Teaching programming at NIIT',
    body: 'Taught Python and Flask to diploma students and reviewed their code line by line.',
    era: 'system',
    snippet: '$ flask run\n * Running on :5000',
  },
  {
    when: 'Graduated 2026',
    title: 'BSc Applied Computing, 2:1',
    body: 'University of South Wales. Final year project: SecureSurv, a real time facial recognition system.',
    era: 'system',
    snippet: 'degree.status = "awarded"',
  },
  {
    when: '2024 to now',
    title: 'Production systems',
    body: 'Built and run the AFC platform backend, used by 9,500+ people, from the first model to the last deploy.',
    era: 'system',
    snippet: 'GET /health  200 OK',
  },
];

/* ------------------------------------------------------------
 *  PROJECTS
 *  Each project shows as a card, then opens into a case study
 *  with an architecture diagram built from `architecture`.
 *
 *  Diagram nodes sit on a simple grid: col 0..3 (left to right),
 *  row 0..2 (top to bottom). Edges join node ids.
 * ---------------------------------------------------------- */

export type ArchNode = { id: string; label: string; sub?: string; col: number; row: number; accent?: boolean };
export type ArchEdge = { from: string; to: string; label?: string };

export type Project = {
  id: string;
  name: string;
  tagline: string;
  role: string;
  status: string;
  problem: string;
  built: string[];
  stack: string[];
  impact: { value: string; label: string }[];
  links: { label: string; href: string }[];
  architecture: { nodes: ArchNode[]; edges: ArchEdge[] };
};

export const projects: Project[] = [
  {
    id: 'afc',
    name: 'African Free Fire Community',
    tagline: 'The backend behind an esports community of 9,500+ players.',
    role: 'Sole backend engineer',
    status: 'Live in production',
    problem:
      'A fast growing esports community needed one platform for accounts, match results and rankings, and results had to be trustworthy without someone checking every screenshot by hand.',
    built: [
      'Designed and built the full backend from an empty repo in Django and Django REST Framework.',
      'Own the data models, authentication, leaderboard calculation and every REST endpoint the frontend uses.',
      'Moved slow work into Celery workers with Redis, so uploads and scoring never block a request.',
      'Players upload match screenshots. An OpenAI vision model extracts the results, and the backend validates them against teams and fixtures in the database before anything is scored.',
      'Deploy and operate it on AWS EC2 with S3 for media, including releases and production fixes.',
      'Set up a Git strategy for Django migrations after resolving dependency conflicts across apps.',
    ],
    stack: ['Python', 'Django', 'DRF', 'MySQL', 'Celery', 'Redis', 'AWS EC2', 'S3', 'OpenAI API'],
    impact: [
      { value: '9,500+', label: 'registered users' },
      { value: '1', label: 'engineer on the backend, from scratch to production' },
      { value: 'Auto', label: 'screenshot results validated against the database' },
    ],
    links: [],
    architecture: {
      nodes: [
        { id: 'client', label: 'Web client', sub: 'players and admins', col: 0, row: 1 },
        { id: 'api', label: 'Django + DRF', sub: 'AWS EC2', col: 1, row: 1, accent: true },
        { id: 'db', label: 'MySQL', sub: 'users, matches, ranks', col: 2, row: 2 },
        { id: 's3', label: 'S3', sub: 'screenshots, media', col: 1, row: 0 },
        { id: 'redis', label: 'Redis', sub: 'broker', col: 2, row: 0 },
        { id: 'worker', label: 'Celery workers', sub: 'scoring, leaderboard', col: 3, row: 1, accent: true },
        { id: 'ai', label: 'OpenAI vision', sub: 'result extraction', col: 3, row: 0 },
      ],
      edges: [
        { from: 'client', to: 'api', label: 'REST + auth' },
        { from: 'api', to: 's3', label: 'upload' },
        { from: 'api', to: 'redis', label: 'enqueue' },
        { from: 'api', to: 'db' },
        { from: 'redis', to: 'worker' },
        { from: 'worker', to: 'ai', label: 'extract' },
        { from: 'worker', to: 'db', label: 'validate + score' },
      ],
    },
  },
  {
    id: 'securesurv',
    name: 'SecureSurv',
    tagline: 'Real time facial recognition surveillance, built as my final year project.',
    role: 'Full stack, backend focus',
    status: 'Final year project, 2026',
    problem:
      'Watching live camera feeds for known faces by eye does not scale. The system had to detect and recognise faces across several streams at once without the dashboard falling behind.',
    built: [
      'A recognition engine using OpenCV, dlib and face_recognition to detect, encode and match faces.',
      'Multithreaded stream processing so each camera feed runs concurrently instead of in a queue.',
      'Async processing between capture and recognition so slow frames never stall the pipeline.',
      'A Django REST Framework API that stores identities and detection events and serves them to the UI.',
      'A Next.js dashboard for live alerts, detection history and managing known identities.',
    ],
    stack: ['Python', 'Django', 'DRF', 'OpenCV', 'dlib', 'face_recognition', 'Threading', 'asyncio', 'Next.js'],
    impact: [
      { value: 'Real time', label: 'recognition across concurrent streams' },
      { value: '3', label: 'CV libraries combined into one pipeline' },
      { value: '2:1', label: 'degree this project helped earn' },
    ],
    links: [],
    architecture: {
      nodes: [
        { id: 'cams', label: 'Camera feeds', sub: 'video streams', col: 0, row: 1 },
        { id: 'engine', label: 'Recognition engine', sub: 'OpenCV, dlib', col: 1, row: 1, accent: true },
        { id: 'threads', label: 'Worker threads', sub: 'one per stream', col: 1, row: 0 },
        { id: 'api', label: 'Django REST API', sub: 'events, identities', col: 2, row: 1, accent: true },
        { id: 'db', label: 'Database', sub: 'encodings, events', col: 2, row: 2 },
        { id: 'ui', label: 'Next.js dashboard', sub: 'live alerts', col: 3, row: 1 },
      ],
      edges: [
        { from: 'cams', to: 'engine', label: 'frames' },
        { from: 'engine', to: 'threads' },
        { from: 'engine', to: 'api', label: 'matches' },
        { from: 'api', to: 'db' },
        { from: 'api', to: 'ui', label: 'REST' },
      ],
    },
  },
  {
    id: 'tdl',
    name: 'The Development League',
    tagline: 'A competitive esports platform, now getting an AI coach.',
    role: 'Backend engineer',
    status: 'In active development',
    problem:
      'Competitive players need structured leagues and useful feedback on how to improve, not only a results table.',
    built: [
      'A Django REST Framework backend with a React frontend for leagues, teams and match data.',
      'Integrating an AI coach that sends a player\'s match data to an LLM API and returns specific advice.',
    ],
    stack: ['Python', 'Django', 'DRF', 'React', 'LLM API'],
    impact: [
      { value: 'AI', label: 'coach feature in progress' },
      { value: 'API first', label: 'backend the React app is built on' },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/HabeebFF' }],
    architecture: {
      nodes: [
        { id: 'web', label: 'React app', sub: 'players', col: 0, row: 1 },
        { id: 'api', label: 'Django + DRF', sub: 'leagues, matches', col: 1, row: 1, accent: true },
        { id: 'db', label: 'Database', sub: 'teams, results', col: 2, row: 2 },
        { id: 'coach', label: 'AI coach', sub: 'in progress', col: 2, row: 0, accent: true },
        { id: 'llm', label: 'LLM API', sub: 'advice', col: 3, row: 0 },
      ],
      edges: [
        { from: 'web', to: 'api', label: 'REST' },
        { from: 'api', to: 'db' },
        { from: 'api', to: 'coach', label: 'match data' },
        { from: 'coach', to: 'llm', label: 'prompt' },
      ],
    },
  },
];

/* ------------------------------------------------------------
 *  EXPERIENCE
 * ---------------------------------------------------------- */

export type Job = { role: string; company: string; period: string; place: string; points: string[] };

export const experience: Job[] = [
  {
    role: 'Backend Engineer',
    company: 'African Free Fire Community (AFC)',
    period: 'Jan 2024 to present',
    place: 'Remote',
    points: [
      'Built the platform backend from scratch in Django and DRF. It now serves 9,500+ users.',
      'Own data models, authentication, leaderboard services and the REST API the frontend consumes.',
      'Run it on AWS EC2 with S3 and MySQL, including deployments, Celery and Redis jobs, and production fixes.',
    ],
  },
  {
    role: 'Backend Engineer',
    company: 'Vermillion Enterprise (V-ENT)',
    period: 'May 2023 to Sep 2025',
    place: 'Remote',
    points: [
      'Designed and built REST APIs in Django and DRF on PostgreSQL and MySQL.',
      'Deployed services to AWS EC2 and S3, packaged with Docker and shipped through Git workflows.',
      'Used asyncio and multithreading for concurrent and background workloads. Tested with pytest and Postman before every release.',
    ],
  },
  {
    role: 'Programming Instructor',
    company: 'NIIT',
    period: '2023 to 2025',
    place: 'Remote',
    points: [
      'Taught Python and Flask to diploma students, covering web development, OOP and algorithms.',
      'Mentored students through coursework projects by reviewing their code and helping them debug.',
    ],
  },
];

/* ------------------------------------------------------------
 *  SKILLS
 *  Groups become hubs in the skills graph.
 * ---------------------------------------------------------- */

export type SkillGroup = { id: string; name: string; skills: string[] };

export const skillGroups: SkillGroup[] = [
  { id: 'backend', name: 'Backend', skills: ['Python', 'Django', 'DRF', 'REST API design', 'Celery', 'asyncio', 'Multithreading', 'Flask'] },
  { id: 'data', name: 'Databases', skills: ['PostgreSQL', 'MySQL', 'Redis', 'SQL', 'Django ORM', 'Migrations'] },
  { id: 'cloud', name: 'Cloud / DevOps', skills: ['AWS EC2', 'AWS S3', 'Docker', 'CI/CD', 'Git'] },
  { id: 'testing', name: 'Testing', skills: ['pytest', 'Postman', 'Unit tests', 'API testing'] },
  { id: 'ai', name: 'AI / CV', skills: ['OpenAI API', 'LLM APIs', 'OpenCV', 'dlib', 'face_recognition', 'Pandas', 'NumPy'] },
];

/* ------------------------------------------------------------
 *  CONTACT
 * ---------------------------------------------------------- */

export const contact = {
  heading: 'Need a backend that doesn\'t break?',
  body: 'I\'m looking for Python backend roles in the UK. If you\'re hiring, or want to talk through a system you\'re building, send me a message.',
};
