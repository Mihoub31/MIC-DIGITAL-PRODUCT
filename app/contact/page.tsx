import Link from 'next/link';
import { T } from '../i18n';

const points = ['ct_point_1', 'ct_point_2', 'ct_point_3'];

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
          <span className="eyebrow"><T k="ct_eyebrow" /></span>
          <h1><T k="ct_title" /></h1>
          <p><T k="ct_lead" /></p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-layout">
          <div className="contact-panel">
            <h2><T k="ct_panel_title" /></h2>
            <p><T k="ct_panel_text" /></p>
            <ul className="contact-list">
              {points.map((point) => (
                <li key={point}><T k={point} /></li>
              ))}
            </ul>
          </div>

          <div className="contact-card contact-inline-card">
            <form action="https://formsubmit.co/micdigitalproduct@gmail.com" method="POST" className="contact-form">
              <div className="field-row two-col">
                <div className="field">
                  <label htmlFor="name"><T k="ct_name" /></label>
                  <input id="name" name="name" type="text" required />
                </div>
                <div className="field">
                  <label htmlFor="email"><T k="ct_email" /></label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" required />
                </div>
              </div>

              <div className="field-row two-col">
                <div className="field">
                  <label htmlFor="company"><T k="ct_company" /></label>
                  <input id="company" name="company" type="text" />
                </div>
                <div className="field">
                  <label htmlFor="budget"><T k="ct_budget" /></label>
                  <select id="budget" name="budget">
                    <option value="under-500"><T k="ct_budget_1" /></option>
                    <option value="500-2000"><T k="ct_budget_2" /></option>
                    <option value="2000-5000"><T k="ct_budget_3" /></option>
                    <option value="5000plus"><T k="ct_budget_4" /></option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="message"><T k="ct_message" /></label>
                <textarea id="message" name="message" rows={6} required />
              </div>

              <input type="hidden" name="_subject" value="New CreatorPilot inquiry" />
              <input type="hidden" name="_captcha" value="false" />
              <button type="submit" className="btn btn-primary submit-btn"><T k="ct_send" /></button>
            </form>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>© {new Date().getFullYear()} CreatorPilot</p>
          <div className="footer-links">
            <Link href="/features"><T k="nav_features" /></Link>
            <Link href="/pricing"><T k="nav_pricing" /></Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
