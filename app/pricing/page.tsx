import Link from 'next/link';
import { T } from '../i18n';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    descKey: 'pc_starter_desc',
    featureKeys: ['pc_starter_1', 'pc_starter_2', 'pc_starter_3', 'pc_starter_4'],
    ctaKey: 'pc_starter_cta',
    featured: false
  },
  {
    name: 'Growth',
    price: '$99',
    descKey: 'pc_growth_desc',
    featureKeys: ['pc_growth_1', 'pc_growth_2', 'pc_growth_3', 'pc_growth_4'],
    ctaKey: 'pc_growth_cta',
    featured: true
  },
  {
    name: 'Scale',
    price: null,
    descKey: 'pc_scale_desc',
    featureKeys: ['pc_scale_1', 'pc_scale_2', 'pc_scale_3', 'pc_scale_4'],
    ctaKey: 'pc_scale_cta',
    featured: false
  }
];

export default function PricingPage() {
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
          <span className="eyebrow"><T k="pc_eyebrow" /></span>
          <h1><T k="pc_title" /></h1>
          <p><T k="pc_lead" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pricing-grid page-pricing-grid">
            {plans.map((plan) => (
              <article key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <span className="popular"><T k="pc_popular" /></span>}
                <p className="plan-name">{plan.name}</p>
                <h3>{plan.price ?? <T k="pc_custom" />}</h3>
                <p className="plan-desc"><T k={plan.descKey} /></p>
                <ul>
                  {plan.featureKeys.map((feature) => (
                    <li key={feature}><T k={feature} /></li>
                  ))}
                </ul>
                <Link href="/contact" className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}>
                  <T k={plan.ctaKey} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container calculator-box">
          <div className="section-head left-aligned">
            <span className="eyebrow"><T k="pc_estimator_eyebrow" /></span>
            <h2><T k="pc_estimator_title" /></h2>
          </div>
          <div className="estimate-card">
            <div className="estimate-item">
              <span>Starter</span>
              <strong>$29</strong>
            </div>
            <div className="estimate-item">
              <span>Growth</span>
              <strong>$99</strong>
            </div>
            <div className="estimate-item">
              <span>Scale</span>
              <strong><T k="pc_custom" /></strong>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} CreatorPilot</p>
          <div className="footer-links">
            <Link href="/features"><T k="nav_features" /></Link>
            <Link href="/contact"><T k="nav_contact" /></Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
