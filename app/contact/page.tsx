import Link from 'next/link';

export default function ContactPage() {
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
          <span className="eyebrow">Contact</span>
          <h1>Let’s build your content engine.</h1>
          <p>Tell us what you’re creating, where you’re publishing, and what your team needs to scale.</p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-panel">
            <h2>Tell us about your workflow.</h2>
            <p>
              We’ll help you design a content system for your team, your channels, and your growth goals.
            </p>
            <ul className="contact-list">
              <li>Strategy + AI workflow planning</li>
              <li>Content systems for launch and growth</li>
              <li>Support for creators, agencies, and brands</li>
            </ul>
          </div>

          <div className="contact-card contact-inline-card">
            <form action="https://formsubmit.co/micdigitalproduct@gmail.com" method="POST" className="contact-form">
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
                  <input id="company" name="company" type="text" placeholder="Brand or agency" />
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
                <textarea id="message" name="message" rows={6} placeholder="Tell us about the content you want to create and the channels you’re using..." required />
              </div>

              <input type="hidden" name="_subject" value="New CreatorPilot inquiry" />
              <input type="hidden" name="_captcha" value="false" />
              <button type="submit" className="btn btn-primary submit-btn">Send inquiry</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} CreatorPilot</p>
          <div className="footer-links">
            <Link href="/features">Features</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
