'use client';

import { languages, useLang } from './i18n';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      aria-label="Language"
      style={{
        position: 'fixed',
        bottom: 16,
        insetInlineEnd: 16,
        zIndex: 1000,
        padding: '8px 12px',
        borderRadius: 10,
        border: '1px solid #89a8ff',
        background: '#0f2036',
        color: '#e9eefb',
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
