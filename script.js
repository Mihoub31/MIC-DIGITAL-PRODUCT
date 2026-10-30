:root {
  --bg: #07111f;
  --bg-soft: #0d1b2a;
  --panel: rgba(15, 24, 38, 0.8);
  --panel-strong: #101d2d;
  --card: #111f2f;
  --text: #e9edf5;
  --muted: #9caec8;
  --primary: #7c9cff;
  --primary-2: #8ef0d2;
  --accent: #ffb86c;
  --line: rgba(255, 255, 255, 0.08);
  --shadow: rgba(12, 18, 30, 0.45);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: "Inter", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(124, 156, 255, 0.22), transparent 26%),
    radial-gradient(circle at bottom right, rgba(142, 240, 210, 0.18), transparent 22%),
    var(--bg);
  color: var(--text);
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

.container {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
}

.page-shell {
  min-height: 100vh;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(20px);
  background: rgba(7, 17, 31, 0.7);
  border-bottom: 1px solid var(--line);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 80px;
  gap: 1rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: #08131f;
  font-weight: 800;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  color: var(--muted);
}

.main-nav a {
  transition: color 0.2s ease;
}

.main-nav a:hover {
  color: var(--text);
}

.nav-cta {
  margin-left: 0.4rem;
}

.nav-toggle {
  display: none;
  background: transparent;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 0.55rem 0.6rem;
  cursor: pointer;
}

.nav-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  border-radius: 999px;
  background: var(--text);
  margin: 5px 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1.4rem;
  border-radius: 14px;
  border: 1px solid transparent;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), #b68eff);
  color: #08131f;
  box-shadow: 0 20px 40px rgba(124, 156, 255, 0.28);
}

.btn-secondary {
  border-color: var(--line);
  background: rgba(255, 255, 255, 0.02);
}

.hero {
  padding: 5rem 0 3rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 2rem;
}

.eyebrow {
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.72rem;
  color: var(--primary-2);
  font-weight: 700;
}

.hero-copy h1,
.section-head h2,
.about-copy h2,
.cta-box h2 {
  margin: 0;
  letter-spacing: -0.06em;
  line-height: 1.05;
}

.hero-copy h1 {
  font-size: clamp(2.8rem, 5vw, 5rem);
  max-width: 620px;
}

.lead {
  max-width: 640px;
  margin: 1.3rem 0 0;
  font-size: 1.08rem;
  line-height: 1.75;
  color: var(--muted);
}

.cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.trust-list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 0;
  margin: 2rem 0 0;
}

.trust-list li {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.trust-list strong {
  font-size: 1.5rem;
}

.trust-list span {
  color: var(--muted);
  font-size: 0.86rem;
}

.glass-card {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02));
  border: 1px solid var(--line);
  box-shadow: var(--shadow) 0 24px 64px;
  border-radius: 32px;
}

.dashboard-card {
  padding: 1.2rem;
  position: relative;
}

.dashboard-card::before {
  content: "";
  position: absolute;
  inset: -10% 20% auto auto;
  width: 160px;
  height: 160px;
  background: rgba(124, 156, 255, 0.14);
  filter: blur(40px);
}

.dashboard-topbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.dashboard-topbar span {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.38);
}

.dashboard-body {
  display: grid;
  gap: 1rem;
}

.metric-row {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 1rem;
}

.metric {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 1rem;
}

.metric small,
.metric span,
.chart-header,
.activity-list p,
.project-card li,
.testimonial footer {
  color: var(--muted);
}

.metric strong {
  display: block;
  font-size: clamp(1.5rem, 2vw, 2.1rem);
  margin: 0.55rem 0 0.3rem;
}

.trend {
  font-size: 0.8rem;
  font-weight: 600;
}

.trend.up {
  color: var(--primary-2);
}

.chart-block {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 1rem;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.chip {
  background: rgba(124, 156, 255, 0.12);
  border: 1px solid rgba(124, 156, 255, 0.25);
  color: var(--primary-2);
  border-radius: 999px;
  padding: 0.3rem 0.6rem;
  font-size: 0.72rem;
}

.bars {
  display: flex;
  align-items: end;
  gap: 0.6rem;
  height: 120px;
}

.bars span {
  flex: 1;
  border-radius: 14px 14px 8px 8px;
  background: linear-gradient(180deg, var(--primary-2), var(--primary));
  box-shadow: 0 12px 20px rgba(124, 156, 255, 0.2);
}

.activity-list {
  display: grid;
  gap: 0.8rem;
}

.activity-list div {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 14px;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--line);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.dot.green {
  background: var(--primary-2);
}

.dot.purple {
  background: #b99cff;
}

.logos {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.01);
}

.logos-row {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 1rem;
  padding: 1rem 0;
  text-align: center;
  color: rgba(233, 237, 245, 0.7);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.72rem;
}

.section {
  padding: 6rem 0;
}

.section-alt {
  background: rgba(255, 255, 255, 0.015);
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.section-head {
  max-width: 720px;
  margin-bottom: 2.6rem;
}

.section-head h2,
.about-copy h2,
.cta-box h2 {
  font-size: clamp(2.2rem, 4vw, 3.2rem);
}

.services-grid,
.process-grid,
.testimonial-grid {
  display: grid;
  gap: 1.2rem;
}

.services-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.service-card,
.process-step,
.testimonial,
.project-card,
.about-card {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.02);
}

.service-card {
  padding: 1.6rem;
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(124, 156, 255, 0.12);
  color: var(--primary-2);
  font-weight: 700;
  margin-bottom: 1rem;
}

.service-card h3,
.project-card h3,
.process-step h3,
.pulse-card h3 {
  margin: 0 0 0.7rem;
  font-size: 1.5rem;
  letter-spacing: -0.04em;
}

.service-card p,
.project-card p,
.process-step p,
.about-copy p,
.pulse-card p,
.testimonial {
  margin: 0;
  line-height: 1.7;
  color: var(--muted);
}

.process-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.process-step {
  padding: 1.6rem;
}

.step-number {
  display: inline-flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(124, 156, 255, 0.18), rgba(142, 240, 210, 0.12));
  color: var(--primary-2);
  font-weight: 800;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
}

.project-card {
  overflow: hidden;
  padding: 1.4rem;
  position: relative;
}

.project-card::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 130px;
  background: linear-gradient(135deg, rgba(124, 156, 255, 0.18), rgba(142, 240, 210, 0.12));
}

.project-card > * {
  position: relative;
  z-index: 1;
}

.project-badge {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.32rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--line);
  color: var(--primary-2);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project-card ul {
  padding-left: 1.1rem;
  margin: 1rem 0 0;
  display: grid;
  gap: 0.5rem;
}

.about-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1.4rem;
  align-items: center;
}

.check-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.check-list span {
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.02);
  padding: 0.7rem 0.9rem;
  border-radius: 999px;
  color: var(--text);
}

.about-card {
  min-height: 320px;
  padding: 1.5rem;
  display: grid;
  place-items: center;
}

.pulse-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  border-radius: 24px;
  background: linear-gradient(135deg, rgba(124, 156, 255, 0.15), rgba(142, 240, 210, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.06);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.testimonial-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.testimonial {
  padding: 1.5rem;
  font-size: 1.02rem;
  line-height: 1.8;
}

.testimonial footer {
  margin-top: 1rem;
  font-size: 0.88rem;
}

.cta-section {
  padding-top: 2rem;
}

.cta-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 2rem 2.2rem;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(124, 156, 255, 0.1), rgba(142, 240, 210, 0.08));
}

.site-footer {
  border-top: 1px solid var(--line);
  padding: 1.2rem 0 2rem;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  color: var(--muted);
}

.footer-links {
  display: flex;
  gap: 1.2rem;
}

.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 900px) {
  .hero-grid,
  .about-grid,
  .services-grid,
  .showcase-grid,
  .testimonial-grid,
  .process-grid {
    grid-template-columns: 1fr 1fr;
  }

  .about-grid,
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .cta-box,
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 700px) {
  .nav-toggle {
    display: block;
  }

  .main-nav {
    position: absolute;
    left: 1rem;
    right: 1rem;
    top: calc(100% + 0.5rem);
    display: none;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: rgba(7, 17, 31, 0.94);
    box-shadow: var(--shadow) 0 24px 64px;
  }

  .main-nav.open {
    display: flex;
  }

  .nav-cta {
    margin-left: 0;
  }

  .services-grid,
  .showcase-grid,
  .testimonial-grid,
  .process-grid,
  .logos-row {
    grid-template-columns: 1fr;
  }

  .hero {
    padding-top: 4rem;
  }

  .section {
    padding: 4.5rem 0;
  }
}
