'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const languages = [
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'zh', label: '中文', dir: 'ltr' },
];

const translations: Record<string, Record<string, string>> = {
  fr: {
    nav_features: 'Fonctionnalités',
    nav_about: 'À propos',
    nav_pricing: 'Tarifs',
    nav_contact: 'Contact',
    nav_start: 'Commencer gratuitement',
    hero_eyebrow: 'Moteur de contenu IA',
    hero_title_1: 'Transformez une idée en une véritable ',
    hero_title_2: 'machine à vidéos et à contenu.',
    hero_lead:
      'CreatorPilot aide les créateurs, les agences et les marques à générer scripts, accroches, miniatures, voix off et systèmes de publication à partir d’un seul brief, sans jongler entre plusieurs outils.',
    hero_cta_primary: 'Essai gratuit',
    hero_cta_secondary: 'Découvrir les fonctionnalités',
    trust_1: 'production de contenu plus rapide',
    trust_2: 'du prompt au script',
    trust_3: 'automatisation IA',
  },
  en: {
    nav_features: 'Features',
    nav_about: 'About',
    nav_pricing: 'Pricing',
    nav_contact: 'Contact',
    nav_start: 'Start free',
    hero_eyebrow: 'AI content engine',
    hero_title_1: 'Turn one idea into a full ',
    hero_title_2: 'video and content machine.',
    hero_lead:
      'CreatorPilot helps creators, agencies, and brands generate scripts, hooks, thumbnails, voiceovers, and publishing systems from a single brief without juggling multiple tools.',
    hero_cta_primary: 'Start free trial',
    hero_cta_secondary: 'Explore features',
    trust_1: 'faster content output',
    trust_2: 'from prompt to script',
    trust_3: 'AI automation',
  },
  es: {
    nav_features: 'Funciones',
    nav_about: 'Acerca de',
    nav_pricing: 'Precios',
    nav_contact: 'Contacto',
    nav_start: 'Empieza gratis',
    hero_eyebrow: 'Motor de contenido con IA',
    hero_title_1: 'Convierte una idea en una auténtica ',
    hero_title_2: 'máquina de vídeo y contenido.',
    hero_lead:
      'CreatorPilot ayuda a creadores, agencias y marcas a generar guiones, ganchos, miniaturas, locuciones y sistemas de publicación a partir de un solo brief, sin combinar varias herramientas.',
    hero_cta_primary: 'Prueba gratuita',
    hero_cta_secondary: 'Ver funciones',
    trust_1: 'producción de contenido más rápida',
    trust_2: 'del prompt al guion',
    trust_3: 'automatización con IA',
  },
  ar: {
    nav_features: 'المزايا',
    nav_about: 'من نحن',
    nav_pricing: 'الأسعار',
    nav_contact: 'اتصل بنا',
    nav_start: 'ابدأ مجانًا',
    hero_eyebrow: 'محرك محتوى بالذكاء الاصطناعي',
    hero_title_1: 'حوّل فكرة واحدة إلى ',
    hero_title_2: 'آلة متكاملة للفيديو والمحتوى.',
    hero_lead:
      'يساعد CreatorPilot صنّاع المحتوى والوكالات والعلامات التجارية على إنشاء النصوص والعناوين الجذابة والصور المصغّرة والتعليق الصوتي وأنظمة النشر انطلاقًا من موجز واحد، دون التنقل بين أدوات متعددة.',
    hero_cta_primary: 'ابدأ تجربتك المجانية',
    hero_cta_secondary: 'اكتشف المزايا',
    trust_1: 'إنتاج محتوى أسرع',
    trust_2: 'من الفكرة إلى النص',
    trust_3: 'أتمتة بالذكاء الاصطناعي',
  },
  zh: {
    nav_features: '功能',
    nav_about: '关于',
    nav_pricing: '价格',
    nav_contact: '联系',
    nav_start: '免费开始',
    hero_eyebrow: 'AI 内容引擎',
    hero_title_1: '把一个创意变成完整的',
    hero_title_2: '视频与内容生产机器。',
    hero_lead:
      'CreatorPilot 帮助创作者、营销机构和品牌仅凭一份简报，就能生成脚本、开场钩子、缩略图、配音和发布体系，无需在多个工具之间来回切换。',
    hero_cta_primary: '免费试用',
    hero_cta_secondary: '了解功能',
    trust_1: '内容产出更快',
    trust_2: '从提示到脚本',
    trust_3: 'AI 自动化',
  },
};

type LangContextType = { lang: string; setLang: (code: string) => void };

const LangContext = createContext<LangContextType>({ lang: 'fr', setLang: () => {} });

function applyToDocument(code: string) {
  const item = languages.find((l) => l.code === code) ?? languages[0];
  document.documentElement.lang = item.code;
  document.documentElement.dir = item.dir;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState('fr');

  useEffect(() => {
    let saved = 'fr';
    try {
      saved = localStorage.getItem('lang') || 'fr';
    } catch {}
    if (!languages.some((l) => l.code === saved)) saved = 'fr';
    applyToDocument(saved);
    setLangState(saved);
  }, []);

  function setLang(code: string) {
    applyToDocument(code);
    setLangState(code);
    try {
      localStorage.setItem('lang', code);
    } catch {}
  }

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export function T({ k }: { k: string }) {
  const { lang } = useLang();
  return <>{translations[lang]?.[k] ?? translations.fr[k] ?? k}</>;
}
