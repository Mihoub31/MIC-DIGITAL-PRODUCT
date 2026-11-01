import Link from 'next/link';

const values = [
  'Creator-first design',
  'Purpose-built for content teams',
  'Operational clarity across every campaign',
  'AI-assisted execution with strategic control'
];

export default function AboutPage() {
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
          <span className="eyebrow">About</span>
          <h1>We built CreatorPilot for people who need more than AI prompts.</h1>
          <p>
            CreatorPilot is designed for modern creators, small teams, and growth-focused brands that want a repeatable content engine instead of disconnected tools.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container two-column about-layout">
          <div>
            <span className="eyebrow">Our mission</span>
            <h2>Help teams create faster, publish smarter, and scale with less friction.</h2>
          </div>
          <div>
            <p>
              Most content teams don’t need more AI outputs; they need a system that turns ideas into strategy, publishing, and measurable results.
              CreatorPilot brings those moving parts together in one operating layer.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="values-grid">
            {values.map((item) => (
              <div className="value-card" key={item}>
                <div className="icon">✦</div>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} CreatorPilot</p>
          <div className="footer-links">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
