import Link from 'next/link';
import { T, EmailField } from './i18n';

const features = [
  { number: '01', title: 'feat_1_title', text: 'feat_1_text' },
  { number: '02', title: 'feat_2_title', text: 'feat_2_text' },
  { number: '03', title: 'feat_3_title', text: 'feat_3_text' },
  { number: '04', title: 'feat_4_title', text: 'feat_4_text' },
  { number: '05', title: 'feat_5_title', text: 'feat_5_text' },
  { number: '06', title: 'feat_6_title', text: 'feat_6_text' }
];

const trustMetrics = [
  { value: '10x', key: 'trust_1' },
  { value: '3 min', key: 'trust_2' },
  { value: '24/7', key: 'trust_3' }
];

const proofLogos = ['Notion', 'Stripe', 'Figma', 'Slack', 'Webflow', 'Linear'];

const testimonials = [
  { quote: 't1_quote', author: 'Aiden Moore', role: 't1_role' },
  { quote: 't2_quote', author: 'Lina Patel', role: 't2_role' },
  { quote: 't3_quote', author: 'Samir Haddad', role: 't3_role' }
];

const customerProof = [
  { stat: '6.2x', label: 'proof_1_label', detail: 'proof_1_detail' },
  { stat: '74%', label: 'proof_2_label', detail: 'proof_2_detail' },
  { stat: '3.1x', label: 'proof_3_label', detail: 'proof_3_detail' }
];

const steps = [
  { number: '1', title: 'step_1_title', text: 'step_1_text' },
  { number: '2', title: 'step_2_title', text: 'step_2_text' },
  { number: '3', title: 'step_3_title', text: 'step_3_text' },
  { number: '4', title: 'step_4_title', text: 'step_4_text' }
];

export default function Page() {
  return (
    <main className="page-shell">
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

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><T k="hero_eyebrow" /></span>
            <h1>
              <T k="hero_title_1" />
              <span className="text-gradient"><T k="hero_title_2" /></span>
            </h1>
            <p className="lead"><T k="hero_lead" /></p>

            <div className="cta-row">
              <Link href="/contact" className="btn btn-primary"><T k="hero_cta_primary" /></Link>
              <Link href="/features" className="btn btn-secondary"><T k="hero_cta_secondary" /></Link>
            </div>

            <ul className="trust-list" aria-label="Key metrics">
              {trustMetrics.map((metric) => (
                <li key={metric.value}>
                  <strong>{metric.value}</strong>
                  <span><T k={metric.key} /></span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-visual">
            <div className="glass-card dashboard-card animate-float">
              <div className="dashboard-topbar">
                <span />
                <span />
                <span />
              </div>

              <div className="dashboard-body">
                <div className="metric-row">
                  <div className="metric large-metric">
                    <small><T k="dash_campaigns" /></small>
                    <strong>48</strong>
                    <span className="trend up">+214%</span>
                  </div>
                  <div className="metric mini-metric">
                    <small><T k="dash_videos" /></small>
                    <strong>19</strong>
                  </div>
                </div>

                <div className="chart-block">
                  <div className="chart-header">
                    <span><T k="dash_growth" /></span>
                    <span className="chip">Q3</span>
                  </div>
                  <div className="bars" aria-hidden="true">
                    <span style={{ height: '26%' }} />
                    <span style={{ height: '40%' }} />
                    <span style={{ height: '54%' }} />
                    <span style={{ height: '72%' }} />
                    <span style={{ height: '64%' }} />
                    <span style={{ height: '86%' }} />
                    <span style={{ height: '100%' }} />
                  </div>
                </div>

                <div className="activity-list">
                  <div>
                    <span className="dot green" />
                    <p><T k="dash_act1" /></p>
                  </div>
                  <div>
                    <span className="dot purple" />
                    <p><T k="dash_act2" /></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="logos">
        <div className="container">
          <p className="section-label"><T k="logos_label" /></p>
          <div className="logo-row" aria-label="Trusted by modern teams and software brands">
            {proofLogos.map((logo) => (
              <span key={logo} className="logo-pill">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><T k="act_eyebrow" /></span>
            <h2><T k="act_title" /></h2>
          </div>

          <div className="mockup-grid">
            <div className="mockup-column">
              <div className="mockup-card mockup-window animate-rise">
                <div className="shot-header">
                  <div className="shot-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="shot-badge"><T k="act_badge" /></span>
                </div>
                <div className="shot-body">
                  <div className="story-row">
                    <div className="story-block story-large"></div>
                    <div className="story-stack">
                      <div className="story-block story-small"></div>
                      <div className="story-block story-medium"></div>
                    </div>
                  </div>
                  <div className="list-row">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="mini-chart">
                    <span style={{ height: '30%' }} />
                    <span style={{ height: '48%' }} />
                    <span style={{ height: '62%' }} />
                    <span style={{ height: '82%' }} />
                    <span style={{ height: '100%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mockup-column stack-column">
              <div className="mockup-card mini-panel animate-rise delay-1">
                <div className="mini-header">
                  <span className="eyebrow tiny-eyebrow"><T k="act_auto" /></span>
                  <span className="status-dot"><T k="act_live" /></span>
                </div>
                <h3><T k="act_hook_title" /></h3>
                <p><T k="act_hook_text" /></p>
                <div className="tag-group">
                  <span><T k="tag_hook" /></span>
                  <span><T k="tag_scene" /></span>
                  <span><T k="tag_cta" /></span>
                </div>
              </div>

              <div className="mockup-card mini-panel animate-rise delay-2">
                <div className="mini-header">
                  <span className="eyebrow tiny-eyebrow"><T k="act_publishing" /></span>
                </div>
                <div className="schedule-row">
                  <div>
                    <strong>09:30</strong>
                    <span><T k="act_post_yt" /></span>
                  </div>
                  <div>
                    <strong>12:00</strong>
                    <span><T k="act_shorts" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><T k="proof_eyebrow" /></span>
            <h2><T k="proof_title" /></h2>
          </div>

          <div className="proof-grid">
            {customerProof.map((item) => (
              <article key={item.label} className="proof-card">
                <strong>{item.stat}</strong>
                <h3><T k={item.label} /></h3>
                <p><T k={item.detail} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><T k="feat_eyebrow" /></span>
            <h2><T k="feat_title" /></h2>
          </div>

          <div className="services-grid">
            {features.map((feature) => (
              <article className="service-card" key={feature.number}>
                <div className="icon">{feature.number}</div>
                <h3><T k={feature.title} /></h3>
                <p><T k={feature.text} /></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container impact-grid">
          <div className="impact-copy">
            <span className="eyebrow"><T k="impact_eyebrow" /></span>
            <h2><T k="impact_title" /></h2>
            <p><T k="impact_text" /></p>
          </div>

          <div className="stats-grid">
            <div className="stat-card glass-card">
              <strong>6.2x</strong>
              <span><T k="proof_1_label" /></span>
            </div>
            <div className="stat-card glass-card">
              <strong>74%</strong>
              <span><T k="proof_2_label" /></span>
            </div>
            <div className="stat-card glass-card">
              <strong>3.1x</strong>
              <span><T k="proof_3_label" /></span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><T k="process_eyebrow" /></span>
            <h2><T k="process_title" /></h2>
          </div>

          <div className="process-grid">
            {steps.map((step) => (
              <div className="process-step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3><T k={step.title} /></h3>
                <p><T k={step.text} /></p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow"><T k="fb_eyebrow" /></span>
            <h2><T k="fb_title" /></h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <blockquote className="testimonial" key={item.author}>
                <p>“<T k={item.quote} />”</p>
                <footer>
                  <strong>{item.author}</strong>
                  <span><T k={item.role} /></span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section newsletter-section">
        <div className="container newsletter-grid">
          <div className="newsletter-copy">
            <span className="eyebrow"><T k="nl_eyebrow" /></span>
            <h2><T k="nl_title" /></h2>
            <p><T k="nl_text" /></p>
          </div>

          <form action="https://formsubmit.co/micdigitalproduct@gmail.com" method="POST" className="newsletter-form">
            <div className="input-group">
              <EmailField k="nl_placeholder" />
              <button type="submit" className="btn btn-primary"><T k="nl_button" /></button>
            </div>
            <div className="form-meta">
              <span><T k="nl_meta" /></span>
            </div>
            <input type="hidden" name="_subject" value="New CreatorPilot growth kit request" />
            <input type="hidden" name="_captcha" value="false" />
          </form>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pricing-preview">
            <div className="section-head pricing-head">
              <span className="eyebrow"><T k="pr_eyebrow" /></span>
              <h2><T k="pr_title" /></h2>
            </div>

            <div className="pricing-grid">
              <article className="pricing-card">
                <p className="plan-name">Starter</p>
                <h3>$29</h3>
                <p className="plan-desc"><T k="pr_starter_desc" /></p>
                <ul>
                  <li><T k="pr_starter_1" /></li>
                  <li><T k="pr_starter_2" /></li>
                  <li><T k="pr_starter_3" /></li>
                  <li><T k="pr_starter_4" /></li>
                </ul>
                <Link href="/pricing" className="btn btn-secondary"><T k="pr_view" /></Link>
              </article>

              <article className="pricing-card featured">
                <span className="popular"><T k="pr_popular" /></span>
                <p className="plan-name">Growth</p>
                <h3>$99</h3>
                <p className="plan-desc"><T k="pr_growth_desc" /></p>
                <ul>
                  <li><T k="pr_growth_1" /></li>
                  <li><T k="pr_growth_2" /></li>
                  <li><T k="pr_growth_3" /></li>
                  <li><T k="pr_growth_4" /></li>
                </ul>
                <Link href="/pricing" className="btn btn-primary"><T k="pr_view" /></Link>
              </article>

              <article className="pricing-card">
                <p className="plan-name">Scale</p>
                <h3><T k="pr_custom" /></h3>
                <p className="plan-desc"><T k="pr_scale_desc" /></p>
                <ul>
                  <li><T k="pr_scale_1" /></li>
                  <li><T k="pr_scale_2" /></li>
                  <li><T k="pr_scale_3" /></li>
                  <li><T k="pr_scale_4" /></li>
                </ul>
                <Link href="/contact" className="btn btn-secondary"><T k="pr_quote" /></Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-box">
          <div>
            <span className="eyebrow"><T k="cta_eyebrow" /></span>
            <h2><T k="cta_title" /></h2>
          </div>
          <Link href="/contact" className="btn btn-primary"><T k="cta_button" /></Link>
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
