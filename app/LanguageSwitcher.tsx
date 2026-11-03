'use client';

import { useEffect, useState } from 'react';

const languages = [
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'zh', label: '中文', dir: 'ltr' },
];

function apply(code: string) {
  const item = languages.find((l) => l.code === code) ?? languages[0];
  document.documentElement.lang = item.code;
  document.documentElement.dir = item.dir;
}

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('fr');

  useEffect(() => {
    let saved = 'fr';
    try {
      saved = localStorage.getItem('lang') || 'fr';
    } catch {}
    setLang(saved);
    apply(saved);
  }, []);

  function change(code: string) {
    setLang(code);
    apply(code);
    try {
      localStorage.setItem('lang', code);
    } catch {}
  }

  return (
    <select
      value={lang}
      onChange={(e) => change(e.target.value)}
      aria-label="Language"
      style={{
        position: 'fixed',
        top: 12,
        insetInlineEnd: 12,
        zIndex: 1000,
        padding: '6px 10px',
        borderRadius: 8,
        border: '1px solid #ccc',
        background: '#fff',
        color: '#111',
      }}
    >
      {languages.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
