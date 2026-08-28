export interface Project {
  id: string
  num: string
  title: string
  tagline: string
  description: string
  role: string
  tech: string[]
  features: string[]
  architecture: string
  challenges: string
  solutions: string
  results: string
  metrics: string[]
  color: string
  accent: string
  hasVideo: boolean
  /** Paste a YouTube, Vimeo, or Google Drive share URL here to embed a demo video on the project page. */
  videoUrl?: string
  /** Live, publicly reachable URL for the deployed project, if one exists. */
  liveUrl?: string
  liveLinks?: ProjectLink[]
  githubLinks?: ProjectLink[]
}

export interface ProjectLink {
  label: string
  description: string
  href: string
}

export interface Tech {
  id: string
  name: string
  category: string
  description: string
  projects: string[]
  icon: string
}

export const projects: Project[] = [
  {
    id: 'eschool',
    num: '01',
    title: 'E-SCHOOL',
    tagline: 'Frontend Developer · Educational Platform',
    description: 'A modern educational platform built for a Saudi company, remotely. I owned the entire frontend — every component, route, and API integration.',
    role: 'Frontend Developer',
    tech: ['React', 'TypeScript', 'Vite', 'React Router', 'REST API Integration'],
    features: [
      'Full frontend build from a feature-based architecture (auth, landing, student modules)',
      'Reusable component library shared across the app',
      'Client-side routing across authenticated and public flows',
      'Integration with backend REST APIs for all student-facing data',
      'Responsive UI tested across devices',
    ],
    architecture: 'A React + TypeScript single-page app built with Vite, organized by feature (auth, landing, student) with a shared layer for components, API logic, hooks, context, and utilities. Path aliases (`@/*`) keep imports clean across the codebase.',
    challenges: 'Working remotely on an existing codebase for a Saudi company, and owning the entire frontend solo — every component, every route, every integration point with the backend team\'s API.',
    solutions: 'Followed the project\'s established feature-based structure closely, kept components small and reusable, and worked directly against the backend APIs to integrate and test each feature end-to-end before handoff.',
    results: 'Shipped a fully working frontend, integrated and tested against the live backend, now running in production.',
    metrics: ['Remote Saudi Team', 'Solo Frontend Owner', 'Vite + TypeScript'],
    color: '#4a7cf5',
    accent: '#6d9fff',
    hasVideo: true,
    videoUrl: 'https://drive.google.com/file/d/1dGWdy5C-wmMBbJwRO-aFSoOZ70WHytKn/view?usp=sharing',
    liveUrl: 'https://www.thalaix.com/',
  },
  {
    id: 'blanko',
    num: '02',
    title: 'BLANKO',
    tagline: 'Full Stack Developer · E-Commerce Platform',
    description: 'A complete Arabic e-commerce platform built solo, front to back — product variants, cart, wishlist, coupons, six payment methods, and a full admin dashboard.',
    role: 'Full Stack Developer',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Context API', 'Django', 'Django REST Framework', 'SimpleJWT', 'SQLite'],
    features: [
      'Product variant system — colors, sizes, and per-size stock, with automatic inventory calculation',
      'Cart, wishlist, and coupon system with percentage and fixed discounts',
      'Six payment methods including Cash on Delivery, Vodafone Cash, InstaPay, and bank transfer',
      'Shipping fees configurable per Egyptian governorate',
      'Admin dashboard with sales, revenue, and product-performance analytics',
    ],
    architecture: 'Next.js + React + TypeScript frontend styled with Tailwind CSS, talking to a Django REST Framework backend secured with SimpleJWT (access + refresh tokens). State is managed through dedicated Auth, Cart, and Wishlist contexts. SQLite backs 12 models across 13 tables.',
    challenges: 'A single product can have several colors, each color its own image and several sizes, and each size its own stock — all of which has to roll up into an accurate total inventory, update safely on every purchase, and stay backward-compatible with simpler products.',
    solutions: 'Modeled the data hierarchically as Product → Variant (Color) → Size, with automatic total-inventory calculations, safe stock-reduction logic on checkout, and `prefetch_related` to keep the variant queries fast.',
    results: 'A production-ready storefront and admin system covering the full purchase flow, with a fully Arabic interface and responsive design across mobile, tablet, and desktop.',
    metrics: ['13 Storefront Pages', '30+ API Endpoints', '12 Data Models'],
    color: '#d98a3d',
    accent: '#f0ac6b',
    hasVideo: true,
    videoUrl: 'https://drive.google.com/file/d/1IK6YzPgpIuSj93vnZZRfXWcYm3h732at/view?usp=sharing',
    liveUrl: 'https://ecommerceblanco.vercel.app/',
    githubLinks: [
      { label: 'FRONTEND REPOSITORY', description: 'Explore the storefront source code', href: 'https://github.com/RaniaAhmed56/E-commerce_frontend' },
      { label: 'BACKEND REPOSITORY', description: 'Explore the API source code', href: 'https://github.com/RaniaAhmed56/E-commerce_backend' },
    ],
  },
  {
    id: 'child-tracking',
    num: '03',
    title: 'SMART CHILD TRACKING',
    tagline: 'Backend Developer · Child Safety System',
    description: 'My graduation project — a real-time child-tracking system built around smart bracelets. I built the entire backend: location tracking, notifications, and live updates.',
    role: 'Backend Developer',
    tech: ['Django', 'Django REST Framework', 'Django Channels', 'PostgreSQL', 'SQLite', 'Firebase', 'JWT'],
    features: [
      'Real-time location tracking with latitude/longitude and location history',
      'Smart bracelet status: battery level, connection state, last known location',
      'Parent and emergency notifications delivered via Firebase',
      'Live WebSocket updates for location and notifications via Django Channels',
      'Secure JWT authentication with hashed passwords and parent/child profiles',
    ],
    architecture: 'A Django + Django REST Framework backend with Django Channels for WebSocket connections, backed by PostgreSQL/SQLite. Firebase handles push notifications. Core models: User, Child, Bracelet, LocationRequest, RecentPlace, Location, and Notification.',
    challenges: 'Delivering location updates and alerts to parents in real time — not on a polling delay — while keeping the whole system secure enough to handle children\'s location and medical data responsibly.',
    solutions: 'Used Django Channels to open persistent WebSocket connections for live location and notification delivery, layered JWT authentication with Django\'s built-in password hashing, and added CORS/CSRF protection with the Django ORM guarding against SQL injection by design.',
    results: 'A working end-to-end backend for real-time tracking and alerts, completed as my graduation project.',
    metrics: ['7 Core Models', 'JWT Authentication', 'Real-Time WebSockets'],
    color: '#2fa88f',
    accent: '#5cc9b0',
    hasVideo: true,
    videoUrl: 'https://drive.google.com/file/d/1XjWbl1BVXNpg2w3xVTR9y2yw7TsvOmLK/view?usp=sharing',
  },
  {
    id: 'cyberguard',
    num: '04',
    title: 'CYBERGUARD PRO',
    tagline: 'Frontend Developer · Cybersecurity Platform UI',
    description: 'The interface for a cybersecurity automation platform — dashboards for vulnerability tracking, security requests, reports, and a dedicated client portal.',
    role: 'Frontend Developer',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'React Hook Form', 'Zod', 'Recharts'],
    features: [
      'Main dashboard with vulnerability severity metrics and interactive charts',
      'Security request tracking with priorities, statuses, comments, and attachments',
      'Report generator supporting executive, technical, compliance, and pentest report types',
      'Role-based views for Admin, Security Team, and regular users',
      'A separate client portal for files, reports, and settings',
    ],
    architecture: 'A Next.js + TypeScript frontend built on Radix UI primitives and Tailwind CSS, with Recharts for the data visualizations, React Hook Form + Zod for validated forms, and next-themes for light/dark mode.',
    challenges: 'Presenting dense security data — scan results, severity levels, request statuses, report types — in a way that stays clear and scannable across three different user roles.',
    solutions: 'Built a reusable dashboard layout with consistent chart and card components, and split the admin/security-team and client experiences into separate portals so each role only sees what\'s relevant to it.',
    results: 'A polished, responsive dashboard UI covering scanning, reporting, and client-facing views, ready to connect to a real scanning backend.',
    metrics: ['4 Report Types', 'Role-Based UI', 'Light + Dark Theme'],
    color: '#d6483f',
    accent: '#ea6f66',
    hasVideo: true,
    videoUrl: 'https://drive.google.com/file/d/18A-opFHm7PdzCHnIL30RAY2bOnkQCcwJ/view?usp=sharing',
  },
  {
    id: 'masaken',
    num: '05',
    title: 'MASAKEN',
    tagline: 'Frontend Developer · Apartment Marketplace',
    description: 'A two-sided apartment marketplace with separate seller and buyer experiences — role-based signup, subscription tiers, and an AI-search interface.',
    role: 'Frontend Developer',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'shadcn/ui'],
    features: [
      'Separate Seller and Buyer dashboards with distinct visual themes',
      'Role-based signup flow branching into Property Owner or Apartment Seeker',
      'Four-tier subscription plans for both sellers and buyers',
      'AI-powered search interface for apartment discovery',
      'Booking/scheduling flow and a two-way rating system UI',
    ],
    architecture: 'A React + TypeScript SPA built with Vite, styled with Tailwind CSS and shadcn/ui components, animated with Framer Motion. Routes split cleanly into public, seller, and buyer sections.',
    challenges: 'Designing one product that genuinely feels like two — property owners and apartment seekers needed distinct dashboards, themes, and flows without the codebase splitting into two separate apps.',
    solutions: 'Built shared layout and UI primitives, then themed and routed the seller and buyer experiences separately on top of them, keeping the component library reusable across both.',
    results: 'A complete, production-ready frontend for both roles, fully responsive and prepared for backend integration.',
    metrics: ['2 Dashboard Roles', '4-Tier Pricing', 'AI Search UI'],
    color: '#8b6fd6',
    accent: '#ab94ea',
    hasVideo: true,
    videoUrl: 'https://drive.google.com/file/d/14ODZzVOkPCkyAz0a6L8fJkn35bbfxOnk/view?usp=sharing',
    liveUrl: 'https://masskan-integration.vercel.app/',
    liveLinks: [
      { label: 'QUICK FRONTEND', description: 'Browse the frontend with mock data', href: 'https://masskan-ten.vercel.app/' },
      { label: 'FULL INTEGRATION', description: 'Use the frontend connected to the backend', href: 'https://masskan-integration.vercel.app/' },
      { label: 'BACKEND API', description: 'Open the deployed backend service', href: 'https://masskan-backend-kohl.vercel.app/' },
    ],
    githubLinks: [
      { label: 'FRONTEND REPOSITORY', description: 'Frontend with mock data for quick review', href: 'https://github.com/RaniaAhmed56/masskan' },
      { label: 'INTEGRATION REPOSITORY', description: 'Frontend connected to the backend', href: 'https://github.com/RaniaAhmed56/masskan_integration' },
      { label: 'BACKEND REPOSITORY', description: 'Backend API source code', href: 'https://github.com/RaniaAhmed56/masskan_backend' },
    ],
  },
  {
    id: 'neuxpos',
    num: '06',
    title: 'NEUXPOS SYSTEM',
    tagline: 'Backend Developer · POS & Billing API',
    description: 'A backend API for a point-of-sale system — invoicing, partial payments, installments, and sales analytics. A separate Flutter app (built by another developer) consumes it.',
    role: 'Backend Developer',
    tech: ['Django', 'Django REST Framework', 'SimpleJWT', 'SQLite'],
    features: [
      'Sales, purchase, and return invoicing with full CRUD',
      'Partial payments and installment plans with tracked remaining balances',
      'Customer and supplier management APIs',
      'Sales, purchase, profit, and cashbox analytics endpoints',
      'JWT, session, and token authentication support',
    ],
    architecture: 'A Django REST Framework backend organized into auth, products, partners, and billing apps, with ~49 endpoints across roughly 14 models and SQLite as the database. Relations follow standard one-to-many patterns — invoices to items, products to categories.',
    challenges: 'Modeling invoice and payment flows that support partial payments and installments correctly — tracking paid amounts, remaining balances, and rolling all of it up into accurate sales, purchase, and profit analytics.',
    solutions: 'Designed dedicated payment and invoice models with `paid_amount`, `remaining_amount`, and `installment_months` fields, then built aggregation endpoints on top for dashboard-level stats.',
    results: 'A complete backend API layer that a separately built Flutter frontend (developed by another team member) connects to for day-to-day POS operations.',
    metrics: ['49 API Endpoints', '14 Data Models', 'JWT + Session Auth'],
    color: '#5b6b9e',
    accent: '#8393c7',
    hasVideo: true,
    videoUrl: 'https://drive.google.com/file/d/1-n4Yl7rdsDN6KLDrfTozyzu76nxBcDeu/view?usp=sharing',
    liveUrl: 'https://pos-prototype-omega.vercel.app/',
    liveLinks: [
      { label: 'POS LIVE APP', description: 'Open the deployed POS application', href: 'https://pos-prototype-omega.vercel.app/' },
      { label: 'THALAIX WEBSITE', description: 'Visit the Thalaix product website', href: 'https://www.thalaix.com/' },
    ],
  },
]

export const techStack: Tech[] = [
  // Frontend
  { id: 'react', name: 'React', category: 'Frontend', description: 'Core UI library across nearly every project — component architecture, hooks, and state management for interactive interfaces.', projects: ['E-School', 'BLANKO', 'CyberGuard Pro', 'Masaken'], icon: '⬡' },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', description: 'Used for BLANKO and CyberGuard Pro — routing, server-side rendering, and production-grade app structure.', projects: ['BLANKO', 'CyberGuard Pro'], icon: '▲' },
  { id: 'html', name: 'HTML', category: 'Frontend', description: 'Semantic markup underlying every interface built.', projects: ['All Projects'], icon: '◇' },
  { id: 'css', name: 'CSS', category: 'Frontend', description: 'Custom styling and layout work across projects, alongside utility-first frameworks.', projects: ['All Projects'], icon: '◈' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'Frontend', description: 'Utility-first styling used across BLANKO, CyberGuard Pro, and Masaken for fast, consistent, responsive design.', projects: ['BLANKO', 'CyberGuard Pro', 'Masaken'], icon: '#' },
  { id: 'vite', name: 'Vite', category: 'Frontend', description: 'Build tool for E-School and Masaken — fast dev server and optimized production builds.', projects: ['E-School', 'Masaken'], icon: '⚡' },
  { id: 'react-router', name: 'React Router', category: 'Frontend', description: 'Client-side routing for E-School\'s authenticated and public flows.', projects: ['E-School'], icon: '⇄' },
  { id: 'context-api', name: 'Context API', category: 'Frontend', description: 'State management for auth, cart, and wishlist state in BLANKO.', projects: ['BLANKO'], icon: '◐' },
  { id: 'framer-motion', name: 'Framer Motion', category: 'Frontend', description: 'Smooth, production-quality animations for Masaken\'s dashboards and transitions.', projects: ['Masaken'], icon: '◉' },
  { id: 'shadcn', name: 'shadcn/ui', category: 'Frontend', description: 'Accessible, composable component primitives used in Masaken.', projects: ['Masaken'], icon: '▣' },
  { id: 'radix-ui', name: 'Radix UI', category: 'Frontend', description: 'Headless UI primitives underlying CyberGuard Pro\'s dashboard components.', projects: ['CyberGuard Pro'], icon: '◭' },
  { id: 'react-hook-form', name: 'React Hook Form', category: 'Frontend', description: 'Efficient form state and validation handling in CyberGuard Pro.', projects: ['CyberGuard Pro'], icon: '▤' },
  { id: 'zod', name: 'Zod', category: 'Frontend', description: 'Schema validation paired with React Hook Form for reliable form data.', projects: ['CyberGuard Pro'], icon: 'Z' },
  { id: 'recharts', name: 'Recharts', category: 'Frontend', description: 'Interactive charts powering CyberGuard Pro\'s security metrics and trends.', projects: ['CyberGuard Pro'], icon: '📊' },
  { id: 'lucide-react', name: 'Lucide React', category: 'Frontend', description: 'Consistent icon set used across every project\'s UI.', projects: ['All Projects'], icon: '✦' },

  // Backend
  { id: 'django', name: 'Django', category: 'Backend', description: 'Primary backend framework — used for BLANKO, Smart Child Tracking, and NeuxPosSystem.', projects: ['BLANKO', 'Smart Child Tracking', 'NeuxPosSystem'], icon: '◈' },
  { id: 'drf', name: 'Django REST', category: 'Backend', description: 'Built and documented every REST API across my Django projects — serialization, permissions, and structured endpoints.', projects: ['BLANKO', 'Smart Child Tracking', 'NeuxPosSystem'], icon: '◉' },
  { id: 'channels', name: 'Django Channels', category: 'Backend', description: 'WebSocket support for Smart Child Tracking\'s real-time location and notification updates.', projects: ['Smart Child Tracking'], icon: '⚡' },
  { id: 'jwt', name: 'JWT / SimpleJWT', category: 'Backend', description: 'Token-based authentication (access + refresh) across BLANKO, Smart Child Tracking, and NeuxPosSystem.', projects: ['BLANKO', 'Smart Child Tracking', 'NeuxPosSystem'], icon: '🔐' },
  { id: 'websockets', name: 'WebSockets', category: 'Backend', description: 'Real-time, bidirectional communication for live location and notification delivery.', projects: ['Smart Child Tracking'], icon: '↯' },
  { id: 'firebase', name: 'Firebase', category: 'Backend', description: 'Push notification delivery for Smart Child Tracking\'s parent and emergency alerts.', projects: ['Smart Child Tracking'], icon: '🔥' },
  { id: 'cors', name: 'CORS', category: 'Backend', description: 'Cross-origin configuration connecting each frontend safely to its Django backend.', projects: ['BLANKO', 'Smart Child Tracking'], icon: '⇋' },

  // Languages
  { id: 'typescript', name: 'TypeScript', category: 'Language', description: 'Type-safe development across E-School, BLANKO, CyberGuard Pro, and Masaken.', projects: ['E-School', 'BLANKO', 'CyberGuard Pro', 'Masaken'], icon: 'TS' },
  { id: 'javascript', name: 'JavaScript', category: 'Language', description: 'Core language underlying every frontend project.', projects: ['All Projects'], icon: 'JS' },
  { id: 'python', name: 'Python', category: 'Language', description: 'Primary backend language for every Django project.', projects: ['BLANKO', 'Smart Child Tracking', 'NeuxPosSystem'], icon: '🐍' },

  // Databases
  { id: 'sqlite', name: 'SQLite', category: 'Database', description: 'Default database for BLANKO and NeuxPosSystem — models, relations, and migrations.', projects: ['BLANKO', 'NeuxPosSystem'], icon: '⛁' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', description: 'Relational database used for Smart Child Tracking\'s production data.', projects: ['Smart Child Tracking'], icon: '🐘' },

  // Tools
  { id: 'git', name: 'Git', category: 'Infrastructure', description: 'Version control across every project.', projects: ['All Projects'], icon: '⎇' },
  { id: 'github', name: 'GitHub', category: 'Infrastructure', description: 'Source hosting and collaboration for all repositories.', projects: ['All Projects'], icon: '⌥' },
  { id: 'npm', name: 'npm', category: 'Infrastructure', description: 'Package management for every JavaScript/TypeScript project.', projects: ['All Projects'], icon: '📦' },
  { id: 'pip', name: 'pip', category: 'Infrastructure', description: 'Python package management for every Django backend.', projects: ['BLANKO', 'Smart Child Tracking', 'NeuxPosSystem'], icon: '🐍' },
  { id: 'nodejs', name: 'Node.js', category: 'Infrastructure', description: 'JavaScript runtime powering frontend tooling and dev servers.', projects: ['All Projects'], icon: '⬢' },
  { id: 'eslint', name: 'ESLint', category: 'Infrastructure', description: 'Linting for consistent, error-free code across frontend projects.', projects: ['E-School', 'BLANKO', 'CyberGuard Pro', 'Masaken'], icon: '⬣' },
]
