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
  /** Paste a YouTube or Vimeo URL here to embed a demo video on the project page. */
  videoUrl?: string
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
    tagline: 'Digital Education Platform',
    description: 'A comprehensive e-learning platform bridging educators and students through live classes, AI-powered tools, and intelligent progress tracking.',
    role: 'Full Stack Developer',
    tech: ['React', 'Django', 'PostgreSQL', 'AWS', 'WebSocket'],
    features: [
      'Live video classrooms with real-time interaction',
      'AI-powered assignment grading system',
      'Student progress analytics dashboard',
      'Course content management system',
      'Multi-language support across 12 languages',
    ],
    architecture: 'Microservices with event-driven communication via WebSocket. React SPA on the frontend, Django REST API backend, PostgreSQL for relational data, AWS S3 for media.',
    challenges: 'Handling concurrent live sessions at scale while maintaining low latency for real-time interactions across different geographic regions.',
    solutions: 'Implemented WebSocket server with Redis pub/sub for session management. CDN distribution via CloudFront for video content delivery.',
    results: 'Reduced page load time by 60%. Supported 500+ concurrent users in live sessions without degradation.',
    metrics: ['500+ concurrent users', '60% faster load time', '98% uptime SLA'],
    color: '#4a7cf5',
    accent: '#6d9fff',
    hasVideo: false,
  },
  {
    id: 'trading-hub',
    num: '02',
    title: 'TRADING HUB',
    tagline: 'Professional Trading Operations Platform',
    description: 'An enterprise trading platform with real-time market data streams, portfolio management, advanced charting, and automated strategy execution.',
    role: 'Full Stack Developer',
    tech: ['React', 'Next.js', 'Django', 'PostgreSQL', 'Kafka', 'Docker'],
    features: [
      'Real-time market data streaming via Kafka',
      'Advanced portfolio analytics with risk metrics',
      'Automated trading strategy engine',
      'Multi-asset class support',
      'Regulatory compliance reporting',
    ],
    architecture: 'Event-driven architecture with Kafka for real-time data streams. Next.js SSR for initial performance. Dockerized microservices. PostgreSQL with time-series extensions.',
    challenges: 'Processing thousands of real-time market events per second while keeping the UI responsive and accurate.',
    solutions: 'Implemented Kafka consumer groups for parallel processing. React virtualization for massive data lists. WebSocket diffing for incremental UI updates.',
    results: 'Processing 10,000+ market events/second. Sub-100ms UI updates for live price data across all instruments.',
    metrics: ['10K+ events/sec', '<100ms latency', '99.9% uptime'],
    color: '#22c55e',
    accent: '#4ade80',
    hasVideo: false,
  },
  {
    id: 'bamboo-learn',
    num: '03',
    title: 'BAMBOO LEARN',
    tagline: 'Adaptive Learning Environment',
    description: 'A mindful, adaptive learning platform designed for focused education with personalized learning paths and distraction-free UX.',
    role: 'Full Stack Developer',
    tech: ['React', 'TypeScript', 'Python', 'MongoDB', 'Node.js'],
    features: [
      'Adaptive learning path algorithm',
      'Focus mode with distraction blocking',
      'Spaced repetition memory system',
      'Progress visualization and insights',
      'Collaborative study rooms',
    ],
    architecture: 'React TypeScript SPA with clean architecture principles. Python ML microservice for adaptive recommendations. MongoDB for flexible content storage. Node.js API gateway.',
    challenges: 'Building a personalization engine that genuinely adapts to individual user behavior patterns in real time.',
    solutions: 'ML-based recommendation system with continuous feedback loops. A/B tested multiple learning path strategies. Personalization improves weekly based on usage.',
    results: 'Users showed 40% better knowledge retention compared to traditional linear platforms.',
    metrics: ['40% better retention', '85% completion rate', '4.8/5 user rating'],
    color: '#84cc16',
    accent: '#a3e635',
    hasVideo: false,
  },
  {
    id: 'kidsai',
    num: '04',
    title: 'KIDSAI',
    tagline: 'AI-Powered Learning for Children',
    description: 'A safe, engaging AI-powered educational platform turning learning into interactive adventures with an intelligent AI companion for children.',
    role: 'Full Stack Developer',
    tech: ['React', 'Next.js', 'Node.js', 'MongoDB', 'AWS'],
    features: [
      'AI learning companion with age-appropriate dialogue',
      'Multi-layer content safety filtering',
      'Gamified learning journeys and achievements',
      'Comprehensive parent progress dashboard',
      'Cross-device progress synchronization',
    ],
    architecture: 'Next.js app with API routes for AI integration layer. Node.js microservices for content management. MongoDB for flexible user data. AWS infrastructure with Lambda functions.',
    challenges: 'Making AI interactions safe, appropriate, and engaging for children ages 6-12 while keeping parents fully informed.',
    solutions: 'Multi-layer content filtering system using pattern matching + LLM moderation. Transparent AI explanations. Granular parent control dashboard.',
    results: 'Launched with 2,000+ active families. 4.9/5 parent satisfaction score. Featured in EdTech Weekly.',
    metrics: ['2K+ active families', '4.9/5 parent rating', '35 min avg. daily session'],
    color: '#f59e0b',
    accent: '#fbbf24',
    hasVideo: false,
  },
  {
    id: 'user-activity',
    num: '05',
    title: 'USER ACTIVITY PLATFORM',
    tagline: 'Enterprise Behavioral Analytics System',
    description: 'An enterprise-grade user behavior analytics platform capturing, processing, and visualizing millions of interactions daily to drive data-informed decisions.',
    role: 'Full Stack Developer',
    tech: ['React', 'TypeScript', 'Django', 'PostgreSQL', 'Kafka', 'Docker', 'AWS'],
    features: [
      'Real-time event capture and processing pipeline',
      'Custom funnel and conversion analysis',
      'Session replay with interaction heatmaps',
      'Behavioral cohort analysis tools',
      'Automated anomaly detection and alerting',
    ],
    architecture: 'High-throughput event ingestion via Kafka. Django backend with complex time-series aggregation. React TypeScript dashboard with real-time WebSocket updates. Containerized with Docker Compose.',
    challenges: 'Storing and querying billions of behavioral events efficiently without compromising sub-second query response times.',
    solutions: 'Time-series optimized PostgreSQL schema with intelligent partitioning. Kafka for async pipeline processing. Redis caching layer for frequent aggregate queries.',
    results: 'Processing 50M+ events daily. Query response times under 500ms at full production scale.',
    metrics: ['50M+ events/day', '<500ms query time', '99.95% data integrity'],
    color: '#8b5cf6',
    accent: '#a78bfa',
    hasVideo: false,
  },
]

export const techStack: Tech[] = [
  { id: 'react', name: 'React', category: 'Frontend', description: 'Building complex interactive UIs with component architecture, custom hooks, and advanced state management patterns.', projects: ['E-School', 'Trading Hub', 'Bamboo Learn', 'KidsAI', 'User Activity'], icon: '⬡' },
  { id: 'nextjs', name: 'Next.js', category: 'Frontend', description: 'Server-side rendering, static generation, and API routes for production-grade performant web applications.', projects: ['Trading Hub', 'KidsAI'], icon: '▲' },
  { id: 'typescript', name: 'TypeScript', category: 'Language', description: 'Type-safe development that catches errors at compile time, improves code quality and team collaboration at scale.', projects: ['Bamboo Learn', 'User Activity'], icon: 'TS' },
  { id: 'javascript', name: 'JavaScript', category: 'Language', description: 'Core language across all frontend and Node.js backend development. Deep knowledge of async patterns, closures, and performance.', projects: ['All Projects'], icon: 'JS' },
  { id: 'django', name: 'Django', category: 'Backend', description: 'Full-featured Python web framework for building robust REST APIs, admin systems, and complex business logic.', projects: ['E-School', 'Trading Hub', 'User Activity'], icon: '◈' },
  { id: 'drf', name: 'Django REST', category: 'Backend', description: 'Powerful toolkit for building and documenting RESTful APIs with serialization, permissions, and throttling.', projects: ['E-School', 'Trading Hub', 'User Activity'], icon: '◉' },
  { id: 'python', name: 'Python', category: 'Language', description: 'Primary backend language. Applied in ML services, data processing pipelines, and web API development.', projects: ['E-School', 'Trading Hub', 'Bamboo Learn', 'User Activity'], icon: '🐍' },
  { id: 'nodejs', name: 'Node.js', category: 'Backend', description: 'Event-driven JavaScript runtime for real-time features, API gateways, and high-throughput microservices.', projects: ['Bamboo Learn', 'KidsAI'], icon: '⬢' },
  { id: 'postgresql', name: 'PostgreSQL', category: 'Database', description: 'Primary relational database for complex queries, transactions, time-series data, and ACID compliance.', projects: ['E-School', 'Trading Hub', 'User Activity'], icon: '🐘' },
  { id: 'mongodb', name: 'MongoDB', category: 'Database', description: 'Flexible document storage for content management, user data, and use cases requiring dynamic schema evolution.', projects: ['Bamboo Learn', 'KidsAI'], icon: '◐' },
  { id: 'kafka', name: 'Kafka', category: 'Infrastructure', description: 'Distributed event streaming platform for building real-time data pipelines handling millions of events at scale.', projects: ['Trading Hub', 'User Activity'], icon: '∿' },
  { id: 'docker', name: 'Docker', category: 'Infrastructure', description: 'Container orchestration for consistent, reproducible deployments across development and production environments.', projects: ['Trading Hub', 'User Activity'], icon: '⊞' },
  { id: 'aws', name: 'AWS', category: 'Cloud', description: 'Cloud infrastructure including EC2, S3, RDS, Lambda, CloudFront, and ECS for scalable production deployments.', projects: ['E-School', 'KidsAI', 'User Activity'], icon: '☁' },
]
