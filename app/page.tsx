'use client';

import { useMemo, useState } from 'react';

const features = [
  {
    number: '01',
    title: 'AI script studio',
    text: 'Generate hooks, scripts, storylines, and variants tailored to your niche, audience, and campaign objective.'
  },
  {
    number: '02',
    title: 'Video planning',
    text: 'Turn one idea into scenes, shot lists, B-roll suggestions, and a structured publishing plan.'
  },
  {
    number: '03',
    title: 'Voiceover & narration',
    text: 'Convert scripts into polished voice tracks with natural pacing and tone control.'
  },
  {
    number: '04',
    title: 'Thumbnail & title engine',
    text: 'Create high-CTR titles and thumbnail concepts designed to earn attention and clicks.'
  },
  {
    number: '05',
    title: 'Publishing workflow',
    text: 'Plan and schedule content across YouTube, Shorts, TikTok, LinkedIn, Instagram, and more.'
  },
  {
    number: '06',
    title: 'Analytics & optimization',
    text: 'Track what converts and let the system recommend the next winning content opportunity.'
  }
];

const steps = [
  {
    number: '1',
    title: 'Brief',
    text: 'Add a topic, niche, audience, or campaign goal and let the system build the strategy.'
  },
  {
    number: '2',
    title: 'Generate',
    text: 'Create scripts, hooks, scenes, outlines, and text variants in seconds.'
  },
  {
    number: '3',
    title: 'Refine',
    text: 'Edit tone, storytelling, format, and publishing direction inside one workflow.'
  },
  {
    number: '4',
    title: 'Publish',
    text: 'Schedule videos, automate delivery, and use real performance data to scale what works.'
  }
];

const pricingMatrix = {
  starter: { base: 29, perAsset: 1.2 },
  growth: { base: 99, perAsset: 1.8 },
  scale: { base: 399, perAsset: 3.6 }
};

export default function Page() {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'scale'>('starter');
  const [volume, setVolume] = useState(18);

  const total = useMemo(() => {
    const { base, perAsset } = pricingMatrix[selectedPlan];
    return base + volume * perAsset;
  }, [selectedPlan, volume]);

  const year = new Date().getFullYear();

  return (
    <main className="page-shell">
      <header className="site-header">
        <div className="container nav">
          <a href="#top" className="brand" aria-label="CreatorPilot home">
            <span className="brand-mark">C</span>
            <span>CreatorPilot</span>
          </a>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <a href="#calculator">Calculator</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
            <a href="#contact" className="btn btn-primary nav-cta">Start free</a>
          </nav>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">AI content engine</span>
            <h1>
              Turn one idea into a full <span className="text-gradient">video & content machine.</span>
            </h1>
            <p className="lead">
              CreatorPilot helps creators, agencies, and brands generate scripts, hooks, thumbnails,
              voiceovers, and publishing plans from a single brief without juggling multiple tools.
            </p>

            <div className="cta-row">
              <a href="#contact" className="btn btn-primary">Start free trial</a>
              <a href="#features" className="btn btn-secondary">Explore features</a>
            </div>

            <ul className="trust-list" aria-label="Key metrics">
              <li>
                <strong>10x</strong>
                <span>faster output</span>
              </li>
              <li>
                <strong>3 min</strong>
                <span>from prompt to draft</span>
              </li>
              <li>
                <strong>24/7</strong>
                <span>AI automation</span>
              </li>
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
        <div className="container logos-row" aria-label="Works for modern teams">
          <span>Creators</span>
          <span>Agencies</span>
          <span>Brands</span>
          <span>Founders</span>
          <span>Teams</span>
        </div>
      </section>

      <section id="features" className="section">
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

      <section id="workflow" className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>A simple workflow. Maximum output.</h2>
          </div>

          <div className="process-grid">
            {steps.map((step) => (
              <div className="process-step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="calculator" className="section">
        <div className="container calculator-wrap">
          <div className="section-head left-aligned">
            <span className="eyebrow">Pricing calculator</span>
            <h2>Estimate your monthly content boost.</h2>
          </div>

          <div className="calculator-grid">
            <div className="calculator-panel">
              <div className="plan-picker">
                {Object.entries(pricingMatrix).map(([plan, value]) => (
                  <label key={plan} className={`plan-option ${selectedPlan === plan ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="plan"
                      checked={selectedPlan === plan}
                      onChange={() => setSelectedPlan(plan as 'starter' | 'growth' | 'scale')}
                    />
                    <span>{plan === 'starter' ? 'Starter' : plan === 'growth' ? 'Growth' : 'Scale'}</span>
                  </label>
                ))}
              </div>

              <div className="slider-block">
                <div className="slider-head">
                  <label htmlFor="volume">Monthly content volume</label>
                  <strong>{volume} assets</strong>
                </div>
                <input
                  id="volume"
                  type="range"
                  min={5}
                  max={100}
                  step={1}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                />
              </div>

              <div className="calculator-metrics">
                <div>
                  <span>Base</span>
                  <strong>${pricingMatrix[selectedPlan].base}</strong>
                </div>
                <div>
                  <span>Projected</span>
                  <strong>${Math.round(total)}</strong>
                </div>
              </div>
            </div>

            <div className="calculator-result">
              <div className="result-label">Estimated monthly cost</div>
              <div className="result-price">${Math.round(total)}</div>
              <p>
                Built for creators, marketing teams, and agencies who need consistent content production at scale.
              </p>
              <a href="#contact" className="btn btn-primary">Book a demo</a>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Plans</span>
            <h2>Simple pricing to grow your content engine.</h2>
          </div>

          <div className="pricing-grid">
            <article className="pricing-card">
              <p className="plan-name">Starter</p>
              <h3>$29</h3>
              <p className="plan-desc">Perfect for solo creators who need consistent content production.</p>
              <ul>
                <li>3 active campaigns</li>
                <li>AI script generation</li>
                <li>Thumbnail and title ideas</li>
                <li>1 publishing channel</li>
              </ul>
              <a href="#contact" className="btn btn-secondary">Start starter</a>
            </article>

            <article className="pricing-card featured">
              <span className="popular">Most popular</span>
              <p className="plan-name">Growth</p>
              <h3>$99</h3>
              <p className="plan-desc">Built for creators and small teams ready to scale repeatable content output.</p>
              <ul>
                <li>Unlimited campaigns</li>
                <li>Voiceover and scripting</li>
                <li>Multi-channel publishing</li>
                <li>Analytics dashboard</li>
              </ul>
              <a href="#contact" className="btn btn-primary">Get growth</a>
            </article>

            <article className="pricing-card">
              <p className="plan-name">Scale</p>
              <h3>Custom</h3>
              <p className="plan-desc">For agencies and brands with custom workflows, team collaboration, and deeper automation.</p>
              <ul>
                <li>Team collaboration</li>
                <li>Custom automations</li>
                <li>Brand kits and templates</li>
                <li>Priority onboarding</li>
              </ul>
              <a href="#contact" className="btn btn-secondary">Request quote</a>
            </article>
          </div>
        </div>
      </section>

      <section id="contact" className="section">
        <div className="container contact-grid">
          <div className="contact-copy">
            <span className="eyebrow">Let’s build your content engine</span>
            <h2>Need a smarter way to scale your content and video output?</h2>
            <p>
              Tell us about your workflow, your goals, and the content you want to produce. We’ll help you design a system that fits your business.
            </p>

            <ul className="contact-quick">
              <li>Strategy + AI workflow planning</li>
              <li>Video and social content systems</li>
              <li>Launch and growth support</li>
            </ul>
          </div>

          <div className="contact-card">
            <form
              className="contact-form"
              action="https://formsubmit.co/micdigitalproduct@gmail.com"
              method="POST"
            >
              <div className="field-row two-col">
                <div className="field">
                  <label htmlFor="name">Full name</label>
                  <input id="name" name="name" type="text" placeholder="Your name" required />
                </div>

                <div className="field">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="field-row two-col">
                <div className="field">
                  <label htmlFor="company">Company</label>
                  <input id="company" name="company" type="text" placeholder="Your brand or agency" />
                </div>

                <div className="field">
                  <label htmlFor="budget">Budget range</label>
                  <select id="budget" name="budget">
                    <option value="under-500">Under $500</option>
                    <option value="500-2000">$500 – $2,000</option>
                    <option value="2000-5000">$2,000 – $5,000</option>
                    <option value="5000plus">$5,000+</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="message">Project details</label>
                <textarea id="message" name="message" rows={5} placeholder="Tell us about the type of content, channels, and goals for your project..." required />
              </div>

              <input type="hidden" name="_subject" value="New CreatorPilot inquiry" />
              <input type="hidden" name="_captcha" value="false" />
              <button className="btn btn-primary submit-btn" type="submit">Send inquiry</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {year} CreatorPilot</p>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#calculator">Calculator</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
