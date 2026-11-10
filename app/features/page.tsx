import Link from 'next/link';
import { T } from '../i18n';

const featureCategories = [
  { titleKey: 'ft_cat_1_title', textKey: 'ft_cat_1_text' },
  { titleKey: 'ft_cat_2_title', textKey: 'ft_cat_2_text' },
  { titleKey: 'ft_cat_3_title', textKey: 'ft_cat_3_text' },
  { titleKey: 'ft_cat_4_title', textKey: 'ft_cat_4_text' }
];

const useCases = ['ft_use_1', 'ft_use_2', 'ft_use_3', 'ft_use_4', 'ft_use_5', 'ft_use_6'];

const steps = [
  { number: '01', textKey: 'ft_step_1' },
  { number: '02', textKey: 'ft_step_2' },
  { number: '03', textKey: 'ft_step_3' },
  { number: '04', textKey: 'ft_step_4' }
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
          <span className="eyebrow"><T k="ft_eyebrow" /></span>
          <h1><T k="ft_title" /></h1>
          <p><T k="ft_lead" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-grid">
            {featureCategories.map((item) => (
              <article className="feature-card" key={item.titleKey}>
                <div className="icon">✦</div>
                <h3><T k={item.titleKey} /></h3>
                <p><T k={item.textKey} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><T k="ft_use_eyebrow" /></span>
            <h2><T k="ft_use_title" /></h2>
          </div>

          <div className="use-case-grid">
            {useCases.map((item) => (
              <div className="use-case-item" key={item}><T k={item} /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div>
            <span className="eyebrow"><T k="ft_flow_eyebrow" /></span>
            <h2><T k="ft_flow_title" /></h2>
          </div>
          <div className="steps-list">
            {steps.map((step) => (
              <div key={step.number}>
                <strong>{step.number}</strong>
                <p><T k={step.textKey} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} CreatorPilot</p>
          <div className="footer-links">
            <Link href="/pricing"><T k="nav_pricing" /></Link>
            <Link href="/contact"><T k="nav_contact" /></Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
