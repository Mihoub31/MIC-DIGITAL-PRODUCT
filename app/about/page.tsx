import Link from 'next/link';
import { T } from '../i18n';

const values = ['ab_value_1', 'ab_value_2', 'ab_value_3', 'ab_value_4'];

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
            <Link href="/features"><T k="nav_features" /></Link>
            <Link href="/about"><T k="nav_about" /></Link>
            <Link href="/pricing"><T k="nav_pricing" /></Link>
            <Link href="/contact"><T k="nav_contact" /></Link>
            <Link href="/contact" className="btn btn-primary nav-cta"><T k="nav_start" /></Link>
          </nav>
        </div>
      </header>

      <section className="page-hero">
        <div className="container narrow">
          <span className="eyebrow"><T k="ab_eyebrow" /></span>
          <h1><T k="ab_title" /></h1>
          <p><T k="ab_lead" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container two-column about-layout">
          <div>
            <span className="eyebrow"><T k="ab_mission_eyebrow" /></span>
            <h2><T k="ab_mission_title" /></h2>
          </div>
          <div>
            <p><T k="ab_mission_text" /></p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="values-grid">
            {values.map((item) => (
              <div className="value-card" key={item}>
                <div className="icon">✦</div>
                <p><T k={item} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} CreatorPilot</p>
          <div className="footer-links">
            <Link href="/features"><T k="nav_features" /></Link>
            <Link href="/pricing"><T k="nav_pricing" /></Link>
            <Link href="/contact"><T k="nav_contact" /></Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
