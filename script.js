const pricingMatrix = {
  starter: { base: 29, perUnit: 1.2 },
  growth: { base: 99, perUnit: 1.8 },
  scale: { base: 399, perUnit: 3.6 }
};

const planOptions = document.querySelectorAll('input[name="plan"]');
const volumeSlider = document.getElementById('contentVolume');
const volumeValue = document.getElementById('volumeValue');
const basePriceEl = document.getElementById('basePrice');
const projectedPriceEl = document.getElementById('projectedPrice');
const totalPriceEl = document.getElementById('totalPrice');

function formatMoney(value) {
  return `$${Math.round(value)}`;
}

function updatePricing() {
  const selectedPlan = document.querySelector('input[name="plan"]:checked')?.value || 'starter';
  const volume = Number(volumeSlider.value || 18);
  const plan = pricingMatrix[selectedPlan];
  const calculated = plan.base + volume * plan.perUnit;

  planOptions.forEach((option) => {
    const optionLabel = option.closest('.plan-option');
    optionLabel.classList.toggle('active', option.checked);
  });

  volumeValue.textContent = `${volume} assets`;
  basePriceEl.textContent = formatMoney(plan.base);
  projectedPriceEl.textContent = formatMoney(calculated);
  totalPriceEl.textContent = formatMoney(calculated);
}

planOptions.forEach((option) => option.addEventListener('change', updatePricing));
volumeSlider.addEventListener('input', updatePricing);
updatePricing();

const langButtons = [...document.querySelectorAll('.lang-btn')];
const defaultLang = 'en';
const storageKey = 'creatorpilot-lang';

const translations = {
  en: {
    nav_home: 'Home',
    nav_features: 'Features',
    nav_workflow: 'Workflow',
    nav_pricing: 'Pricing',
    nav_contact: 'Contact'
  },
  fr: {
    nav_home: 'Accueil',
    nav_features: 'Fonctionnalités',
    nav_workflow: 'Workflow',
    nav_pricing: 'Tarifs',
    nav_contact: 'Contact'
  },
  ar: {
    nav_home: 'الرئيسية',
    nav_features: 'الميزات',
    nav_workflow: 'سير العمل',
    nav_pricing: 'التسعير',
    nav_contact: 'تواصل'
  }
};

function setLanguage(lang) {
  const selected = translations[lang] ? lang : defaultLang;
  document.documentElement.lang = selected;
  document.body.classList.toggle('rtl', selected === 'ar');
  localStorage.setItem(storageKey, selected);

  const navLinks = document.querySelectorAll('.main-nav a');
  if (selected === 'fr') {
    navLinks[0].textContent = translations.fr.nav_features;
    navLinks[1].textContent = translations.fr.nav_workflow;
    navLinks[2].textContent = 'Calculateur';
    navLinks[3].textContent = translations.fr.nav_pricing;
    navLinks[4].textContent = translations.fr.nav_contact;
    navLinks[5].textContent = 'Démarrer';
  } else if (selected === 'ar') {
    navLinks[0].textContent = translations.ar.nav_features;
    navLinks[1].textContent = translations.ar.nav_workflow;
    navLinks[2].textContent = 'آلة الحساب';
    navLinks[3].textContent = translations.ar.nav_pricing;
    navLinks[4].textContent = translations.ar.nav_contact;
    navLinks[5].textContent = 'ابدأ';
  } else {
    navLinks[0].textContent = 'Features';
    navLinks[1].textContent = 'Workflow';
    navLinks[2].textContent = 'Calculator';
    navLinks[3].textContent = 'Pricing';
    navLinks[4].textContent = 'Contact';
    navLinks[5].textContent = 'Start free';
  }

  langButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === selected);
  });
}

langButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

const savedLang = localStorage.getItem(storageKey) || defaultLang;
setLanguage(savedLang);

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Sent successfully';
    submitButton.disabled = true;
    contactForm.reset();

    const formData = new FormData(contactForm);
    const subject = encodeURIComponent('New CreatorPilot inquiry');
    const body = encodeURIComponent(
      `Name: ${formData.get('name')}\nEmail: ${formData.get('email')}\nCompany: ${formData.get('company')}\nBudget: ${formData.get('budget')}\n\nProject: ${formData.get('message')}`
    );

    window.location.href = `mailto:hello@creatorpilot.ai?subject=${subject}&body=${body}`;

    setTimeout(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
}
