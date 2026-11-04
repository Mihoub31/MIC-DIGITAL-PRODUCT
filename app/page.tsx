NanoFile
NanoFile
Search
0-github-profile-avatar.png
74.7 KB
1793441823182.jpg
2.9 MB
Borehole_Diagnostic_and_Rehabilitation_Plan_(2).docx
15.0 MB
Borehole_Diagnostic_and_Rehabilitation_Plan_(2).pdf
14.5 MB
chahin tv.apk
12.5 MB
Claude Setup.exe
6.9 MB
driver-hub-install__31.exe
791.2 KB
Facture_PF-2026-015_Boumous_Cheikh-v4.docx
34.6 KB
mermaid-diagram.png
106.0 KB
Modele_Bordereau_d_Envoi_ANRH.docx
44.4 KB
Modele_Rapport_Endoscopie_Forage.docx
4.9 KB
NotebookLM Mind Map (1).png
2.0 MB
NotebookLM Mind Map (2).png
2.0 MB
NotebookLM Mind Map (3).png
207.7 KB
NotebookLM Mind Map.png
207.7 KB
officedeploymenttool_20131-20090.exe
3.4 MB
Page_de_Garde_Rapport_Endoscopie.docx
40.6 KB
page.tsx
17.7 KB
Qoder-win-x64-user.exe
228.2 MB
Rapport EURL BST V1 (1) 01-08-2026.doc
17.9 MB
vlc-3.0.24-win64.exe
44.1 MB
wps_wid.cid-180325513.1785578753.exe
5.2 MB
import Link from 'next/link';
import { T } from './i18n';

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
  { value: '10x', key: 'trust_1' },
  { value: '3 min', key: 'trust_2' },
  { value: '24/7', key: 'trust_3' }
];

const proofLogos = ['Notion', 'Stripe', 'Figma', 'Slack', 'Webflow', 'Linear'];

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

const customerProof = [
  {
    stat: '6.2x',
    label: 'average increase in publishing velocity',
    detail: 'Teams launch more campaigns without adding more headcount.'
  },
  {
    stat: '74%',
    label: 'more content output with the same team',
    detail: 'AI-assisted planning and repurposing keeps teams focused.'
  },
  {
    stat: '3.1x',
    label: 'faster turnaround on campaign launch',
    detail: 'From brief to production cycle in one streamlined system.'
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
        <div className="container">
          <p className="section-label">Trusted by teams shipping content at scale</p>
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
            <span className="eyebrow">See it in action</span>
            <h2>Built to make content production feel effortless.</h2>
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
                  <span className="shot-badge">Campaign dashboard</span>
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
                  <span className="eyebrow tiny-eyebrow">Auto-script</span>
                  <span className="status-dot">Live</span>
                </div>
                <h3>Hook + CTA generator</h3>
                <p>Turn a single idea into a script outline, story arc, and strong first sentence in seconds.</p>
                <div className="tag-group">
                  <span>Hook</span>
                  <span>Scene</span>
                  <span>CTA</span>
                </div>
              </div>
              <div className="mockup-card mini-panel animate-rise delay-2">
                <div className="mini-header">
                  <span className="eyebrow tiny-eyebrow">Publishing</span>
                </div>
                <div className="schedule-row">
                  <div>
                    <strong>09:30</strong>
                    <span>Post to YouTube</span>
                  </div>
                  <div>
                    <strong>12:00</strong>
                    <span>Schedule Shorts</span>
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
            <span className="eyebrow">Proof</span>
            <h2>Teams scale faster when the workflow is clear.</h2>
          </div>
          <div className="proof-grid">
            {customerProof.map((item) => (
              <article key={item.label} className="proof-card">
                <strong>{item.stat}</strong>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
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
      <section className="section newsletter-section">
        <div className="container newsletter-grid">
          <div className="newsletter-copy">
            <span className="eyebrow">Free growth kit</span>
            <h2>Get the 7-day creator growth playbook.</h2>
            <p>
              Join the newsletter for a simple system to generate better scripts, stronger hooks,
              and a cleaner publishing routine without burning out your team.
            </p>
          </div>
          <form action="https://formsubmit.co/micdigitalproduct@gmail.com" method="POST" className="newsletter-form">
            <div className="input-group">
              <input type="email" name="email" placeholder="Enter your work email" aria-label="Work email" required />
              <button type="submit" className="btn btn-primary">Get the kit</button>
            </div>
            <div className="form-meta">
              <span>No spam. One useful email each week.</span>
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
