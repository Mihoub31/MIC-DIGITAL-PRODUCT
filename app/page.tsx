import Link from 'next/link';

const features = [
  {
    number: '01',
    title: 'AI script studio',
    text: 'Generate hooks, scripts, storylines, and script variations for creators, agencies, and product teams.'
  },
  {
    number: '02',
    title: 'Video planning',
    text: 'Turn any idea into scenes, shot lists, B-roll prompts, and structured publishing systems.'
  },
  {
    number: '03',
    title: 'Voiceover & narration',
    text: 'Convert scripts into polished voice tracks with natural pacing and tailored tone.'
  },
  {
    number: '04',
    title: 'Thumbnail & title engine',
    text: 'Create attention-grabbing titles and thumbnail concepts designed to increase click-through.'
  },
  {
    number: '05',
    title: 'Publishing workflow',
    text: 'Schedule and distribute content across channels without losing consistency or strategic focus.'
  },
  {
    number: '06',
    title: 'Analytics & optimization',
    text: 'Measure what performs best and automatically recommend next steps based on your content data.'
  }
];

const trustMetrics = [
  { value: '10x', label: 'faster content output' },
  { value: '3 min', label: 'from prompt to script' },
  { value: '24/7', label: 'AI automation' }
];

const testimonials = [
  {
    quote: 'CreatorPilot gave our content team a repeatable production engine. We publish faster and with more consistency.',
    author: 'Aiden Moore',
    role: 'Founder, Creator Brand'
  },
  {
    quote: 'It turned our chaotic content process into a real system. We generate campaign-ready assets in minutes.',
    author: 'Lina Patel',
    role: 'Marketing Lead, Digital Agency'
  },
  {
    quote: 'We finally have a way to scale video storytelling without hiring a huge production team.',
    author: 'Samir Haddad',
    role: 'Product Marketer, SaaS Brand'
  }
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
            <Link href="/features">Features</Link>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/contact" className="btn btn-primary nav-cta">Start free</Link>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">AI content engine</span>
            <h1>
              Turn one idea into a full <span className="text-gradient">video and content machine.</span>
            </h1>
            <p className="lead">
              CreatorPilot helps creators, agencies, and brands generate scripts, hooks, thumbnails,
              voiceovers, and publishing systems from a single brief without juggling multiple tools.
            </p>

            <div className="cta-row">
              <Link href="/contact" className="btn btn-primary">Start free trial</Link>
              <Link href="/features" className="btn btn-secondary">Explore features</Link>
            </div>

            <ul className="trust-list" aria-label="Key metrics">
              {trustMetrics.map((metric) => (
                <li key={metric.value}>
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-visual">
            <div className="glass-card dashboard-card">
              <div className="dashboard-topbar">
                <span />
                <span />
                <span />
              </div>

              <div className="dashboard-body">
                <div className="metric-row">
                  <div className="metric large-metric">
                    <small>Campaigns</small>
                    <strong>48</strong>
                    <span className="trend up">+214%</span>
                  </div>
                  <div className="metric mini-metric">
                    <small>Videos</small>
                    <strong>19</strong>
                  </div>
                </div>

                <div className="chart-block">
                  <div className="chart-header">
                    <span>Content growth</span>
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
                    <p>New script batch generated</p>
                  </div>
                  <div>
                    <span className="dot purple" />
                    <p>Publishing workflow optimized</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="logos">
        <div className="container logos-row" aria-label="Trusted by modern teams">
          <span>Creators</span>
          <span>Agencies</span>
          <span>Brands</span>
          <span>Founders</span>
          <span>Teams</span>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What it does</span>
            <h2>Everything your content engine needs.</h2>
          </div>

          <div className="services-grid">
            {features.map((feature) => (
              <article className="service-card" key={feature.number}>
                <div className="icon">{feature.number}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container impact-grid">
          <div className="impact-copy">
            <span className="eyebrow">Built for growth</span>
            <h2>Fewer tools. Faster production. More consistent output.</h2>
            <p>
              We built CreatorPilot for teams that want to move faster without sacrificing quality.
              From idea to publishing, the system keeps your pipeline organized and scalable.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card glass-card">
              <strong>6.2x</strong>
              <span>average increase in publishing velocity</span>
            </div>
            <div className="stat-card glass-card">
              <strong>74%</strong>
              <span>more content output with the same team</span>
            </div>
            <div className="stat-card glass-card">
              <strong>3.1x</strong>
              <span>faster turnaround on campaign launch</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>A simple workflow. Maximum output.</h2>
          </div>

          <div className="process-grid">
            <div className="process-step">
              <span className="step-number">1</span>
              <h3>Brief</h3>
              <p>Add a topic, niche, audience, or campaign goal and let the system build the strategy.</p>
            </div>
            <div className="process-step">
              <span className="step-number">2</span>
              <h3>Generate</h3>
              <p>Create scripts, hooks, scenes, outlines, and text variants in seconds.</p>
            </div>
            <div className="process-step">
              <span className="step-number">3</span>
              <h3>Refine</h3>
              <p>Edit tone, storytelling, format, and publishing direction inside one workflow.</p>
            </div>
            <div className="process-step">
              <span className="step-number">4</span>
              <h3>Publish</h3>
              <p>Schedule videos, automate delivery, and use performance data to scale what works.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Client feedback</span>
            <h2>The right workflow changes everything.</h2>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <blockquote className="testimonial" key={item.author}>
                <p>“{item.quote}”</p>
                <footer>
                  <strong>{item.author}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pricing-preview">
            <div className="section-head pricing-head">
              <span className="eyebrow">Plans</span>
              <h2>Simple pricing to grow your content engine.</h2>
            </div>

            <div className="pricing-grid">
              <article className="pricing-card">
                <p className="plan-name">Starter</p>
                <h3>$29</h3>
                <p className="plan-desc">For solo creators and lean teams.</p>
                <ul>
                  <li>3 active campaigns</li>
                  <li>AI script generation</li>
                  <li>Thumbnail ideas</li>
                  <li>1 publishing channel</li>
                </ul>
                <Link href="/pricing" className="btn btn-secondary">View pricing</Link>
              </article>

              <article className="pricing-card featured">
                <span className="popular">Most popular</span>
                <p className="plan-name">Growth</p>
                <h3>$99</h3>
                <p className="plan-desc">For creators and agencies scaling faster.</p>
                <ul>
                  <li>Unlimited campaigns</li>
                  <li>Voiceover & scripting</li>
                  <li>Multi-channel publishing</li>
                  <li>Analytics dashboard</li>
                </ul>
                <Link href="/pricing" className="btn btn-primary">View pricing</Link>
              </article>

              <article className="pricing-card">
                <p className="plan-name">Scale</p>
                <h3>Custom</h3>
                <p className="plan-desc">For brands with complex needs.</p>
                <ul>
                  <li>Team collaboration</li>
                  <li>Custom automations</li>
                  <li>Brand kits</li>
                  <li>Priority onboarding</li>
                </ul>
                <Link href="/contact" className="btn btn-secondary">Request quote</Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="section cta-section">
        <div className="container cta-box">
          <div>
            <span className="eyebrow">Let’s build your engine</span>
            <h2>Need a smarter way to scale your content and video output?</h2>
          </div>
          <Link href="/contact" className="btn btn-primary">Book a demo</Link>
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
