import { useState, useMemo, useCallback, useEffect } from 'react';
import { categories, featuredProjects, allProjects } from './data/projects';

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#4d9de0',
  Python: '#f4c430',
  JavaScript: '#f0db4f',
  HTML: '#e34c26',
  default: '#8b5cf6',
};

const CATEGORY_ICONS: Record<string, string> = {
  'ai-ml': '🤖',
  'web-apps': '🌐',
  'creative-3d': '✨',
  'hackathons': '🏆',
};

const PRICING_TIERS = [
  {
    id: 'starter',
    name: 'Basic Website',
    emoji: '🚀',
    price: '₹2,000 – ₹5,000',
    usd: '$24–$60',
    idealFor: 'Individuals, students & small businesses',
    timeline: '3–5 days',
    revisions: '1–2 revisions',
    support: '3 days post-delivery',
    color: 'from-cyan-500 to-blue-500',
    accent: '#06b6d4',
    highlights: [
      'Responsive UI design & layout',
      'Landing page or portfolio sections',
      'Project showcase & about sections',
      'Contact form integration',
      'Mobile optimization & smooth animations',
      'Deployment + source code handover',
    ],
  },
  {
    id: 'pro',
    name: 'Medium Website',
    emoji: '⚡',
    price: '₹8,000 – ₹10,000',
    usd: '$96–$120',
    idealFor: 'Startups, agencies & growing businesses',
    timeline: '1–2 weeks',
    revisions: '3 revisions',
    support: '7 days post-delivery',
    color: 'from-violet-500 to-purple-600',
    accent: '#8b5cf6',
    popular: true,
    highlights: [
      'Custom frontend + backend integration',
      'Database setup & authentication',
      'Dynamic forms & user dashboard or CMS',
      'SEO setup & performance optimization',
      'Deployment on Vercel / cloud',
      'Post-delivery support included',
    ],
  },
  {
    id: 'enterprise',
    name: 'Full-Stack + AI',
    emoji: '🏆',
    price: '₹10,000 – ₹15,000',
    usd: '$120–$180',
    idealFor: 'Product companies & AI-driven startups',
    timeline: '2–4 weeks',
    revisions: 'Unlimited',
    support: 'As per package terms',
    color: 'from-amber-500 to-orange-500',
    accent: '#f59e0b',
    highlights: [
      'Complete product architecture & premium UI/UX',
      'Full frontend + backend development',
      'Database, admin panel & AI chatbot / LLM',
      'Payment gateway integration',
      'Testing, deployment & technical handover',
      'Full source code + documentation',
    ],
  },
];

const FEATURE_MATRIX = [
  {
    category: 'UI/UX & Design',
    icon: '🎨',
    features: [
      { name: 'Responsive Mobile-First Design', starter: true, pro: true, enterprise: true },
      { name: 'Custom Animations & Micro-interactions', starter: false, pro: true, enterprise: true },
      { name: 'Dark Mode', starter: false, pro: true, enterprise: true },
      { name: 'Glassmorphism / Premium UI', starter: false, pro: true, enterprise: true },
      { name: 'Figma Design File Handover', starter: false, pro: false, enterprise: true },
      { name: '3D Elements / WebGL', starter: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Pages & Content',
    icon: '📄',
    features: [
      { name: 'Home, About, Contact', starter: true, pro: true, enterprise: true },
      { name: 'Blog / CMS', starter: false, pro: true, enterprise: true },
      { name: 'Dashboard & Analytics View', starter: false, pro: true, enterprise: true },
      { name: 'User Profile & Settings', starter: false, pro: true, enterprise: true },
      { name: 'Admin Panel / Back-office', starter: false, pro: true, enterprise: true },
      { name: 'Multi-tenant / White-label Pages', starter: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Backend & Database',
    icon: '🗄️',
    features: [
      { name: 'REST API / Server-side Logic', starter: false, pro: true, enterprise: true },
      { name: 'Supabase / PostgreSQL / MongoDB', starter: false, pro: true, enterprise: true },
      { name: 'Auth (Email, Google OAuth)', starter: false, pro: true, enterprise: true },
      { name: 'Role-Based Access Control (RBAC)', starter: false, pro: true, enterprise: true },
      { name: 'File Upload & Storage', starter: false, pro: true, enterprise: true },
      { name: 'Transactional Emails (Resend/SendGrid)', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    category: 'AI & Automation',
    icon: '🤖',
    features: [
      { name: 'AI Chatbot (rule-based)', starter: false, pro: false, enterprise: true },
      { name: 'RAG / LLM Integration', starter: false, pro: false, enterprise: true },
      { name: 'Smart Recommendations Engine', starter: false, pro: false, enterprise: true },
      { name: 'AI Analytics Dashboard', starter: false, pro: false, enterprise: true },
      { name: 'Automated Email/Notification Flows', starter: false, pro: true, enterprise: true },
      { name: 'Web Scraping & Data Pipelines', starter: false, pro: false, enterprise: true },
    ],
  },
  {
    category: 'Payments & Integrations',
    icon: '💳',
    features: [
      { name: 'Razorpay / Stripe Payment Gateway', starter: false, pro: true, enterprise: true },
      { name: 'Subscription & Billing Plans', starter: false, pro: false, enterprise: true },
      { name: 'WhatsApp / Telegram Bot', starter: false, pro: false, enterprise: true },
      { name: 'CRM / Notion / Airtable Integration', starter: false, pro: false, enterprise: true },
      { name: 'Third-party API Integrations', starter: false, pro: true, enterprise: true },
      { name: 'Google Analytics / Mixpanel', starter: true, pro: true, enterprise: true },
    ],
  },
  {
    category: 'SEO, Performance & Delivery',
    icon: '📈',
    features: [
      { name: 'SEO Meta Tags & Sitemap', starter: true, pro: true, enterprise: true },
      { name: 'Lighthouse Score 90+', starter: false, pro: true, enterprise: true },
      { name: 'PWA / Offline Support', starter: false, pro: false, enterprise: true },
      { name: 'CI/CD Pipeline (GitHub Actions)', starter: false, pro: false, enterprise: true },
      { name: 'Technical Documentation', starter: false, pro: true, enterprise: true },
      { name: 'Source Code Handover', starter: true, pro: true, enterprise: true },
    ],
  },
];

const ADDONS = [
  { name: 'Logo Design & Branding Kit', price: '₹1,000 – ₹2,500', icon: '🎨' },
  { name: 'Payment Gateway Integration', price: '₹1,500 – ₹2,000', icon: '💳' },
  { name: 'AI Chatbot Integration', price: '₹2,000 – ₹4,000', icon: '🤖' },
  { name: 'WhatsApp / Telegram Integration', price: '₹1,500 – ₹2,500', icon: '📱' },
  { name: 'Blog / CMS System', price: '₹1,000 – ₹2,000', icon: '✍️' },
  { name: 'SEO Optimization', price: '₹1,000 – ₹2,000', icon: '📊' },
  { name: 'Analytics Dashboard', price: '₹2,500 – ₹5,000', icon: '📈' },
  { name: 'Monthly Maintenance', price: '₹500 – ₹1,500/mo', icon: '🛠️' },
  { name: 'Rush Delivery', price: 'Extra cost applies', icon: '⚡' },
  { name: 'Extra Revision Round', price: 'Chargeable per round', icon: '🔄' },
];

const SKILLS = [
  { name: 'TypeScript / JavaScript', level: 92 },
  { name: 'Python', level: 90 },
  { name: 'React / Next.js', level: 90 },
  { name: 'AI / LLM Integration', level: 88 },
  { name: 'Node.js / FastAPI', level: 82 },
  { name: 'Machine Learning', level: 85 },
  { name: 'Supabase / PostgreSQL', level: 78 },
  { name: 'Three.js / WebGL', level: 70 },
];

const TECH_TICKER = [
  'TypeScript','React','Next.js','Python','FastAPI','LangChain',
  'OpenAI','Supabase','PostgreSQL','Three.js','Node.js','TailwindCSS',
  'LightGBM','XGBoost','Streamlit','WebRTC','Prisma','Redis',
  'TypeScript','React','Next.js','Python','FastAPI','LangChain',
  'OpenAI','Supabase','PostgreSQL','Three.js','Node.js','TailwindCSS',
  'LightGBM','XGBoost','Streamlit','WebRTC','Prisma','Redis',
];

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

function VercelIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 76 65" fill="currentColor">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/>
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  );
}

type FilterType = 'all' | 'ai-ml' | 'web-apps' | 'creative-3d' | 'hackathons' | 'featured';

export default function App() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('projects');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowBackToTop(scrollTop > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    setMobileNavOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredCategories = useMemo(() => {
    if (activeFilter === 'featured') {
      return [{
        id: 'featured',
        label: 'Featured Projects',
        icon: '⭐',
        color: 'from-amber-500 to-yellow-500',
        projects: featuredProjects.filter(p =>
          !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
      }];
    }
    return categories
      .filter(c => activeFilter === 'all' || c.id === activeFilter)
      .map(c => ({
        ...c,
        projects: c.projects.filter(p =>
          !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
      }))
      .filter(c => c.projects.length > 0);
  }, [activeFilter, searchQuery]);

  const totalVisible = filteredCategories.reduce((a, c) => a + c.projects.length, 0);

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  }, []);

  return (
    <div>
      {/* SCROLL PROGRESS */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">JSR<span style={{ color: '#06b6d4' }}>.</span>dev</div>
        <div className="nav-links">
          {[['projects','Projects'],['skills','Skills'],['services','Services'],['contact','Contact']].map(([id, label]) => (
            <button key={id} className={`nav-link ${activeSection === id ? 'active' : ''}`} onClick={() => scrollTo(id)}>{label}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="https://github.com/JSR2406" target="_blank" rel="noopener noreferrer" className="nav-github">
            <GitHubIcon /> GitHub
          </a>
          <button className="mobile-menu-btn" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Menu">
            {mobileNavOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* MOBILE NAV */}
      {mobileNavOpen && (
        <div className="mobile-nav">
          {[['projects','🗂️ Projects'],['skills','⚡ Skills'],['services','💼 Services'],['contact','📬 Contact']].map(([id, label]) => (
            <button key={id} className="mobile-nav-link" onClick={() => scrollTo(id)}>{label}</button>
          ))}
          <a href="https://github.com/JSR2406" target="_blank" rel="noopener noreferrer" className="mobile-nav-link">
            <GitHubIcon /> GitHub Profile
          </a>
        </div>
      )}

      {/* HERO */}
      <section className="hero" id="home">
        <div style={{ maxWidth: 720 }}>
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Available for opportunities
          </div>
          <h1 className="hero-name">
            <span className="hero-name-gradient">Janmejay Singh</span>
            <br />
            <span style={{ color: 'rgba(240,240,255,0.7)', fontSize: '0.6em', fontWeight: 400, letterSpacing: '-1px' }}>Rathore</span>
          </h1>
          <p className="hero-tagline">
            <span>Full-Stack Developer</span> &amp; <span>AI Engineer</span>
          </p>
          <p className="hero-desc">
            Building intelligent, production-ready applications — from AI agent frameworks and ML pipelines
            to 3D interactive web experiences and enterprise SaaS platforms.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">{allProjects.length}+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">4</div>
              <div className="stat-label">Domains</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">10+</div>
              <div className="stat-label">Tech Stacks</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">3⭐</div>
              <div className="stat-label">GitHub Stars</div>
            </div>
          </div>
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollTo('projects')}>
              View Projects →
            </button>
            <a href="https://github.com/JSR2406" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <GitHubIcon /> GitHub Profile
            </a>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {TECH_TICKER.map((t, i) => (
            <span key={i} className="ticker-item">
              <span style={{ color: '#8b5cf6', fontSize: '0.65rem' }}>◆</span> {t}
            </span>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main className="main">
        {/* PROJECTS SECTION */}
        <section className="section" id="projects">
          <div className="section-header">
            <div className="section-label">Portfolio</div>
            <h2 className="section-title">All <span>Projects</span></h2>
            <p className="section-desc">
              {allProjects.length} projects across AI/ML, Web Development, Creative 3D, and Hackathons.
            </p>
          </div>

          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon"><SearchIcon /></span>
            <input
              id="project-search"
              className="search-input"
              placeholder="Search projects, tech stacks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {([
              ['all', '🗂️ All', allProjects.length],
              ['featured', '⭐ Featured', featuredProjects.length],
              ['ai-ml', '🤖 AI & ML', categories.find(c=>c.id==='ai-ml')!.projects.length],
              ['web-apps', '🌐 Web Apps', categories.find(c=>c.id==='web-apps')!.projects.length],
              ['creative-3d', '✨ Creative 3D', categories.find(c=>c.id==='creative-3d')!.projects.length],
              ['hackathons', '🏆 Hackathons', categories.find(c=>c.id==='hackathons')!.projects.length],
            ] as [FilterType, string, number][]).map(([id, label, count]) => (
              <button
                key={id}
                id={`filter-${id}`}
                className={`filter-tab ${activeFilter === id ? 'active' : ''}`}
                onClick={() => setActiveFilter(id)}
              >
                {label}
                <span className="filter-tab-count">{count}</span>
              </button>
            ))}
          </div>

          {/* Results count */}
          {searchQuery && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 24 }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{totalVisible}</strong> results for "{searchQuery}"
            </p>
          )}

          {/* Category Sections */}
          {filteredCategories.map(cat => (
            <div key={cat.id} className="category-section">
              <div className="category-header">
                <div className="category-icon">{CATEGORY_ICONS[cat.id] || cat.icon}</div>
                <div className="category-info">
                  <div className="category-title">{cat.label}</div>
                  <div className="category-count">{cat.projects.length} projects</div>
                </div>
                <div className="category-line" />
              </div>

              <div className="project-grid">
                {cat.projects.map(project => {
                  const primaryLang = project.tech[0];
                  const langColor = LANG_COLORS[primaryLang] || LANG_COLORS.default;
                  return (
                    <div
                      key={project.id}
                      className={`project-card ${project.featured ? 'featured' : ''}`}
                      onMouseMove={handleCardMouseMove}
                    >
                      <div className="card-top">
                        <div className="card-icon">
                          {cat.icon}
                        </div>
                        <div className="card-links">
                          {project.live && (
                            <span className="live-badge">
                              <VercelIcon /> Live
                            </span>
                          )}
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card-link"
                            title="View on GitHub"
                          >
                            <GitHubIcon />
                          </a>
                          {project.live && (
                            <a
                              href={project.live}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="card-link card-link-live"
                              title="Live Demo"
                            >
                              <ExternalIcon />
                            </a>
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="card-title">{project.title}</div>
                      </div>

                      <div className="card-desc">{project.description}</div>

                      <div className="card-tech">
                        {project.tech.slice(0, 5).map(t => (
                          <span
                            key={t}
                            className={`tech-tag ${t==='TypeScript'?'ts':t==='Python'?'py':t==='JavaScript'?'js':''}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="card-footer">
                        <div className="card-lang">
                          <div className="lang-dot" style={{ background: langColor }} />
                          {primaryLang || 'Mixed'}
                        </div>
                        {project.stars ? (
                          <div className="card-stars">
                            <StarIcon /> {project.stars}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {totalVisible === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
              <p>No projects found for "{searchQuery}"</p>
            </div>
          )}
        </section>

        {/* SKILLS SECTION */}
        <section className="section" id="skills">
          <div className="section-header">
            <div className="section-label">Expertise</div>
            <h2 className="section-title">Skills &amp; <span>Stack</span></h2>
            <p className="section-desc">Technologies I use to bring ideas to life.</p>
          </div>
          <div className="skills-grid">
            {SKILLS.map(skill => (
              <div key={skill.name} className="skill-card">
                <div className="skill-name">{skill.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <div className="skill-bar" style={{ flex: 1 }}>
                    <div className="skill-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', minWidth: 32 }}>{skill.level}%</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tech Badges */}
          <div style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['React','Next.js','TypeScript','Python','FastAPI','LangChain','OpenAI API','Supabase',
              'PostgreSQL','Node.js','Three.js','Streamlit','LightGBM','XGBoost','CatBoost',
              'Prisma','WebRTC','Redis','Docker','Git'].map(tech => (
              <span key={tech} style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: '0.8rem',
                fontWeight: 500,
                fontFamily: 'JetBrains Mono, monospace',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s',
              }}>{tech}</span>
            ))}
          </div>
        </section>
      </main>

      {/* SERVICES SECTION */}
      <section className="services-section" id="services">
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="section-header">
            <div className="section-label">Hire Me</div>
            <h2 className="section-title">Services &amp; <span>Pricing</span></h2>
            <p className="section-desc">Transparent, fixed pricing for every project size. Choose the plan that fits your needs — or mix &amp; match add-ons.</p>
          </div>

          {/* PRICING TIERS */}
          <div className="pricing-grid">
            {PRICING_TIERS.map(tier => (
              <div key={tier.id} className={`pricing-card ${tier.popular ? 'pricing-popular' : ''}`}>
                {tier.popular && <div className="pricing-badge">⭐ Most Popular</div>}
                <div className="pricing-top">
                  <div className="pricing-emoji">{tier.emoji}</div>
                  <div className="pricing-name">{tier.name}</div>
                  <div className="pricing-price">{tier.price}</div>
                  <div className="pricing-usd">{tier.usd}</div>
                  <div className="pricing-meta">
                    <span>⏱ {tier.timeline}</span>
                    <span>🔄 {tier.revisions}</span>
                    <span>🛡 {tier.support}</span>
                  </div>
                  <div className="pricing-ideal">Ideal for: {tier.idealFor}</div>
                </div>
                <ul className="pricing-features">
                  {tier.highlights.map(h => (
                    <li key={h}><span className="check">✓</span> {h}</li>
                  ))}
                </ul>
                <a
                  href="mailto:janmejaysingh2406@gmail.com?subject=Project%20Inquiry%20-%20"
                  className={`pricing-cta ${tier.popular ? 'pricing-cta-primary' : ''}`}
                >
                  Start with {tier.name} →
                </a>
              </div>
            ))}
          </div>

          {/* FEATURE MATRIX */}
          <div className="matrix-wrap">
            <div className="section-label" style={{ marginBottom: 24 }}>What's Included</div>
            <div className="matrix-header">
              <div className="matrix-feature-col">Feature</div>
              <div className="matrix-tier-col tier-starter">🚀 Basic</div>
              <div className="matrix-tier-col tier-pro">⚡ Medium</div>
              <div className="matrix-tier-col tier-enterprise">🏆 Full-Stack+AI</div>
            </div>
            {FEATURE_MATRIX.map(group => (
              <div key={group.category} className="matrix-group">
                <div className="matrix-category">{group.icon} {group.category}</div>
                {group.features.map(feat => (
                  <div key={feat.name} className="matrix-row">
                    <div className="matrix-feature-col">{feat.name}</div>
                    <div className="matrix-tier-col">{feat.starter ? <span className="matrix-yes">✓</span> : <span className="matrix-no">–</span>}</div>
                    <div className="matrix-tier-col">{feat.pro ? <span className="matrix-yes">✓</span> : <span className="matrix-no">–</span>}</div>
                    <div className="matrix-tier-col">{feat.enterprise ? <span className="matrix-yes">✓</span> : <span className="matrix-no">–</span>}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* ADD-ONS */}
          <div style={{ marginTop: 80 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Extend Any Plan</div>
            <h3 className="section-title" style={{ fontSize: '1.6rem', marginBottom: 32 }}>Add-On <span>Services</span></h3>
            <div className="addons-grid">
              {ADDONS.map(addon => (
                <div key={addon.name} className="addon-card">
                  <div className="addon-icon">{addon.icon}</div>
                  <div className="addon-name">{addon.name}</div>
                  <div className="addon-price">{addon.price}</div>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT MILESTONES */}
          <div className="milestones-wrap">
            <div className="milestone-item">
              <div className="milestone-num">50%</div>
              <div className="milestone-label">Advance</div>
              <div className="milestone-desc">Paid before project starts</div>
            </div>
            <div className="milestone-arrow">→</div>
            <div className="milestone-item">
              <div className="milestone-num">25%</div>
              <div className="milestone-label">Mid-milestone</div>
              <div className="milestone-desc">After design / first milestone approval</div>
            </div>
            <div className="milestone-arrow">→</div>
            <div className="milestone-item">
              <div className="milestone-num">25%</div>
              <div className="milestone-label">Final handover</div>
              <div className="milestone-desc">Before deployment & source code release</div>
            </div>
          </div>

          {/* TERMS & CONDITIONS */}
          <div style={{ marginTop: 48, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '32px 36px', maxWidth: 860, margin: '48px auto 0' }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Terms & Conditions</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px 32px' }}>
              {[
                '📋 Scope changes after approval are charged separately',
                '📁 Client must provide logo, content & references before dev starts',
                '⏳ Delays in content submission may extend the timeline',
                '🌐 Domain, hosting & API costs billed separately unless specified',
                '🛡 Support period depends on selected package',
                '⚡ Rush delivery available at extra cost',
                '🔒 All business information stays strictly confidential',
                '💳 Extra revisions beyond included rounds are chargeable',
                '📦 Source code handed over only after full payment',
                '📅 Quote validity: 30 days from date of issue',
              ].map(term => (
                <div key={term} style={{ display: 'flex', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <span>{term}</span>
                </div>
              ))}
            </div>
          </div>

          {/* START A PROJECT CTA */}
          <div className="services-cta-wrap">
            <div className="services-cta-glow" />
            <div style={{ position: 'relative' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, marginBottom: 12 }}>
                Ready to start your <span style={{ color: 'var(--accent-violet)' }}>project?</span>
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
                Fill out the project intake form and I'll get back within 24 hours with a custom quote.
              </p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a
                  href="mailto:janmejaysingh2406@gmail.com?subject=New%20Project%20Inquiry"
                  className="btn-primary"
                >
                  📬 Email Me Directly
                </a>
                <a
                  href="https://www.linkedin.com/in/janmejay-singh-rathore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  💼 Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section" id="contact">
        <div className="contact-glow" />
        <div style={{ position: 'relative' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Get In Touch</div>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Let's Build Something <span>Amazing</span>
          </h2>
          <p style={{ marginTop: 16, color: 'var(--text-secondary)', maxWidth: 480, margin: '16px auto 0', lineHeight: 1.7 }}>
            Open to full-time roles, freelance projects, and exciting collaborations.
            Feel free to reach out!
          </p>
          <div className="contact-links">
            <a href="https://github.com/JSR2406" target="_blank" rel="noopener noreferrer" className="contact-link">
              <GitHubIcon /> JSR2406 on GitHub
            </a>
            <a href="mailto:janmejaysingh2406@gmail.com" className="contact-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7L13 13.5a2 2 0 01-2 0L2 7"/>
              </svg>
              Send Email
            </a>
            <a href="https://www.linkedin.com/in/janmejay-singh-rathore" target="_blank" rel="noopener noreferrer" className="contact-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>
          Designed &amp; Built by <a href="https://github.com/JSR2406">Janmejay Singh Rathore</a> · {new Date().getFullYear()}
        </p>
        <p style={{ marginTop: 8 }}>
          {allProjects.length} projects · {categories.length} categories · Built with React + Vite
        </p>
      </footer>

      {/* BACK TO TOP */}
      {showBackToTop && (
        <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
          <ArrowUpIcon />
        </button>
      )}
    </div>
  );
}
