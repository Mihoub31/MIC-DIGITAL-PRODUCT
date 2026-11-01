import Link from 'next/link';

const featureCategories = [
  {
    title: 'Content planning',
    text: 'Build complete content systems from basic ideas, briefs, market signals, and audience goals.'
  },
  {
    title: 'Campaign automation',
    text: 'Generate scripts, titles, thumbnails, and publishing plans for each campaign in a single workflow.'
  },
  {
    title: 'Creative QA',
    text: 'Review message clarity, tone, call-to-action strength, and output quality before rollout.'
  },
  {
    title: 'Publishing orchestration',
    text: 'Coordinate the schedule, outputs, and channels your team needs to stay consistent and organized.'
  }
];

const useCases = [
  'YouTube and Shorts channels',
  'Creator-led brand content',
  'Agency client content operations',
  'Product marketing and launch assets',
  'Growth teams and content repurposing',
  'Founder-driven storytelling' 
];

export default function FeaturesPage() {
  return (
    <main className="page-shell page-inner">
      <header className="site-header">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="CreatorPilot home">
            <span className="brand-mark">C</span>
            <span>CreatorPilot</span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <Link href="/features">Features</Link>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/contact" className="btn btn-primary nav-cta">Start free</Link>
          </nav>
        </div>
      </header>

      <section className="page-hero">
        <div className="container narrow">
          <span className="eyebrow">Features</span>
          <h1>Built to turn ideas into content systems.</h1>
          <p>
            CreatorPilot combines AI generation, workflow automation, and publishing logic so your team can move faster without sacrificing quality.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid">
            {featureCategories.map((item) => (
              <article className="feature-card" key={item.title}>
                <div className="icon">✦</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Use cases</span>
            <h2>Built for the way modern teams create.</h2>
          </div>

          <div className="use-case-grid">
            {useCases.map((item) => (
              <div className="use-case-item" key={item}>{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div>
            <span className="eyebrow">Workflow</span>
            <h2>From brief to optimization.</h2>
          </div>
          <div className="steps-list">
            <div>
              <strong>01</strong>
              <p>Drop in a brief, audience, and campaign goal.</p>
            </div>
            <div>
              <strong>02</strong>
              <p>Generate scripts, hooks, titles, and content directions.</p>
            </div>
            <div>
              <strong>03</strong>
              <p>Refine the message, channel strategy, and publication timing.</p>
            </div>
            <div>
              <strong>04</strong>
              <p>Publish and optimize based on what performs best.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} CreatorPilot</p>
          <div className="footer-links">
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
