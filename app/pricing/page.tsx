import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for solo creators who need consistent cadence.',
    features: ['3 active campaigns', 'AI script generation', 'Thumbnail ideas', '1 publishing channel'],
    cta: 'Get started',
    featured: false
  },
  {
    name: 'Growth',
    price: '$99',
    description: 'For creators and agencies scaling content output every week.',
    features: ['Unlimited campaigns', 'Voiceover & scripting', 'Multi-channel publishing', 'Analytics dashboard'],
    cta: 'Choose Growth',
    featured: true
  },
  {
    name: 'Scale',
    price: 'Custom',
    description: 'For brands with custom workflows and advanced operations.',
    features: ['Team collaboration', 'Custom automations', 'Brand kits', 'Priority onboarding'],
    cta: 'Request quote',
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
          <span className="eyebrow">Pricing</span>
          <h1>Simple plans built for growth.</h1>
          <p>Pick the plan that matches your current content volume and scale smoothly as your output grows.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pricing-grid page-pricing-grid">
            {plans.map((plan) => (
              <article key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <span className="popular">Most popular</span>}
                <p className="plan-name">{plan.name}</p>
                <h3>{plan.price}</h3>
                <p className="plan-desc">{plan.description}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link href="/contact" className={`btn ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}>
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container calculator-box">
          <div className="section-head left-aligned">
            <span className="eyebrow">Estimator</span>
            <h2>See how much your monthly output could cost.</h2>
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
              <strong>Custom</strong>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} CreatorPilot</p>
          <div className="footer-links">
            <Link href="/features">Features</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
