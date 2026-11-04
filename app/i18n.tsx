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
    dash_campaigns: 'Campagnes',
    dash_videos: 'Vidéos',
    dash_growth: 'Croissance du contenu',
    dash_act1: 'Nouveau lot de scripts généré',
    dash_act2: 'Flux de publication optimisé',
    logos_label: 'Choisi par des équipes qui produisent du contenu à grande échelle',
    act_eyebrow: 'Voyez-le en action',
    act_title: 'Conçu pour rendre la production de contenu fluide.',
    act_badge: 'Tableau de bord des campagnes',
    act_auto: 'Script automatique',
    act_live: 'En direct',
    act_hook_title: 'Générateur d’accroche et d’appel à l’action',
    act_hook_text:
      'Transformez une simple idée en plan de script, arc narratif et première phrase percutante en quelques secondes.',
    tag_hook: 'Accroche',
    tag_scene: 'Scène',
    tag_cta: 'Appel à l’action',
    act_publishing: 'Publication',
    act_post_yt: 'Publier sur YouTube',
    act_shorts: 'Programmer les Shorts',
    proof_eyebrow: 'Résultats',
    proof_title: 'Les équipes progressent plus vite quand le processus est clair.',
    proof_1_label: 'hausse moyenne de la vitesse de publication',
    proof_1_detail: 'Les équipes lancent plus de campagnes sans recruter davantage.',
    proof_2_label: 'de contenu en plus avec la même équipe',
    proof_2_detail: 'La planification et la réutilisation assistées par IA gardent les équipes concentrées.',
    proof_3_label: 'délai de lancement de campagne plus rapide',
    proof_3_detail: 'Du brief à la production, dans un seul système fluide.',
    feat_eyebrow: 'Ce qu’il fait',
    feat_title: 'Tout ce dont votre moteur de contenu a besoin.',
    feat_1_title: 'Studio de scripts IA',
    feat_1_text:
      'Générez accroches, scripts, trames narratives et variantes pour les créateurs, agences et équipes produit.',
    feat_2_title: 'Planification vidéo',
    feat_2_text:
      'Transformez toute idée en scènes, listes de plans, prompts B-roll et systèmes de publication structurés.',
    feat_3_title: 'Voix off et narration',
    feat_3_text:
      'Convertissez vos scripts en pistes vocales soignées, au rythme naturel et au ton adapté.',
    feat_4_title: 'Moteur de titres et miniatures',
    feat_4_text:
      'Créez des titres accrocheurs et des concepts de miniatures conçus pour augmenter le taux de clics.',
    feat_5_title: 'Flux de publication',
    feat_5_text:
      'Programmez et diffusez vos contenus sur tous les canaux sans perdre en cohérence ni en stratégie.',
    feat_6_title: 'Analyses et optimisation',
    feat_6_text:
      'Mesurez ce qui performe le mieux et recevez automatiquement des recommandations basées sur vos données.',
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
    dash_campaigns: 'Campaigns',
    dash_videos: 'Videos',
    dash_growth: 'Content growth',
    dash_act1: 'New script batch generated',
    dash_act2: 'Publishing workflow optimized',
    logos_label: 'Trusted by teams shipping content at scale',
    act_eyebrow: 'See it in action',
    act_title: 'Built to make content production feel effortless.',
    act_badge: 'Campaign dashboard',
    act_auto: 'Auto-script',
    act_live: 'Live',
    act_hook_title: 'Hook + CTA generator',
    act_hook_text:
      'Turn a single idea into a script outline, story arc, and strong first sentence in seconds.',
    tag_hook: 'Hook',
    tag_scene: 'Scene',
    tag_cta: 'CTA',
    act_publishing: 'Publishing',
    act_post_yt: 'Post to YouTube',
    act_shorts: 'Schedule Shorts',
    proof_eyebrow: 'Proof',
    proof_title: 'Teams scale faster when the workflow is clear.',
    proof_1_label: 'average increase in publishing velocity',
    proof_1_detail: 'Teams launch more campaigns without adding more headcount.',
    proof_2_label: 'more content output with the same team',
    proof_2_detail: 'AI-assisted planning and repurposing keeps teams focused.',
    proof_3_label: 'faster turnaround on campaign launch',
    proof_3_detail: 'From brief to production cycle in one streamlined system.',
    feat_eyebrow: 'What it does',
    feat_title: 'Everything your content engine needs.',
    feat_1_title: 'AI script studio',
    feat_1_text:
      'Generate hooks, scripts, storylines, and script variations for creators, agencies, and product teams.',
    feat_2_title: 'Video planning',
    feat_2_text:
      'Turn any idea into scenes, shot lists, B-roll prompts, and structured publishing systems.',
    feat_3_title: 'Voiceover & narration',
    feat_3_text:
      'Convert scripts into polished voice tracks with natural pacing and tailored tone.',
    feat_4_title: 'Thumbnail & title engine',
    feat_4_text:
      'Create attention-grabbing titles and thumbnail concepts designed to increase click-through.',
    feat_5_title: 'Publishing workflow',
    feat_5_text:
      'Schedule and distribute content across channels without losing consistency or strategic focus.',
    feat_6_title: 'Analytics & optimization',
    feat_6_text:
      'Measure what performs best and automatically recommend next steps based on your content data.',
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
    dash_campaigns: 'Campañas',
    dash_videos: 'Vídeos',
    dash_growth: 'Crecimiento del contenido',
    dash_act1: 'Nuevo lote de guiones generado',
    dash_act2: 'Flujo de publicación optimizado',
    logos_label: 'Elegido por equipos que producen contenido a gran escala',
    act_eyebrow: 'Velo en acción',
    act_title: 'Diseñado para que producir contenido sea sencillo.',
    act_badge: 'Panel de campañas',
    act_auto: 'Guion automático',
    act_live: 'En vivo',
    act_hook_title: 'Generador de gancho y llamada a la acción',
    act_hook_text:
      'Convierte una sola idea en un esquema de guion, un arco narrativo y una primera frase potente en segundos.',
    tag_hook: 'Gancho',
    tag_scene: 'Escena',
    tag_cta: 'Llamada a la acción',
    act_publishing: 'Publicación',
    act_post_yt: 'Publicar en YouTube',
    act_shorts: 'Programar Shorts',
    proof_eyebrow: 'Resultados',
    proof_title: 'Los equipos crecen más rápido cuando el flujo de trabajo es claro.',
    proof_1_label: 'aumento medio de la velocidad de publicación',
    proof_1_detail: 'Los equipos lanzan más campañas sin ampliar la plantilla.',
    proof_2_label: 'más contenido con el mismo equipo',
    proof_2_detail: 'La planificación y la reutilización asistidas por IA mantienen al equipo enfocado.',
    proof_3_label: 'más rápido en lanzar campañas',
    proof_3_detail: 'Del brief a la producción en un solo sistema fluido.',
    feat_eyebrow: 'Qué hace',
    feat_title: 'Todo lo que tu motor de contenido necesita.',
    feat_1_title: 'Estudio de guiones con IA',
    feat_1_text:
      'Genera ganchos, guiones, tramas y variantes para creadores, agencias y equipos de producto.',
    feat_2_title: 'Planificación de vídeo',
    feat_2_text:
      'Convierte cualquier idea en escenas, listas de planos, prompts de B-roll y sistemas de publicación estructurados.',
    feat_3_title: 'Locución y narración',
    feat_3_text:
      'Convierte guiones en pistas de voz pulidas, con ritmo natural y tono a medida.',
    feat_4_title: 'Motor de títulos y miniaturas',
    feat_4_text:
      'Crea títulos llamativos y conceptos de miniaturas diseñados para aumentar el porcentaje de clics.',
    feat_5_title: 'Flujo de publicación',
    feat_5_text:
      'Programa y distribuye contenido en todos los canales sin perder coherencia ni enfoque estratégico.',
    feat_6_title: 'Analítica y optimización',
    feat_6_text:
      'Mide qué funciona mejor y recibe recomendaciones automáticas basadas en los datos de tu contenido.',
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
    dash_campaigns: 'الحملات',
    dash_videos: 'الفيديوهات',
    dash_growth: 'نمو المحتوى',
    dash_act1: 'تم إنشاء دفعة نصوص جديدة',
    dash_act2: 'تم تحسين سير عمل النشر',
    logos_label: 'موثوق به من فرق تنتج المحتوى على نطاق واسع',
    act_eyebrow: 'شاهده في العمل',
    act_title: 'مصمّم ليجعل إنتاج المحتوى سهلًا وسلسًا.',
    act_badge: 'لوحة الحملات',
    act_auto: 'نص تلقائي',
    act_live: 'مباشر',
    act_hook_title: 'مولّد العناوين الجذابة ودعوات اتخاذ الإجراء',
    act_hook_text:
      'حوّل فكرة واحدة إلى مخطط نص وقوس قصصي وجملة افتتاحية قوية خلال ثوانٍ.',
    tag_hook: 'عنوان جذاب',
    tag_scene: 'مشهد',
    tag_cta: 'دعوة لاتخاذ إجراء',
    act_publishing: 'النشر',
    act_post_yt: 'النشر على يوتيوب',
    act_shorts: 'جدولة فيديوهات شورتس',
    proof_eyebrow: 'النتائج',
    proof_title: 'تنمو الفرق أسرع حين يكون سير العمل واضحًا.',
    proof_1_label: 'متوسط الزيادة في سرعة النشر',
    proof_1_detail: 'تطلق الفرق حملات أكثر دون زيادة عدد الموظفين.',
    proof_2_label: 'محتوى أكثر بالفريق نفسه',
    proof_2_detail: 'يحافظ التخطيط وإعادة الاستخدام بمساعدة الذكاء الاصطناعي على تركيز الفرق.',
    proof_3_label: 'أسرع في إطلاق الحملات',
    proof_3_detail: 'من الموجز إلى الإنتاج في نظام واحد سلس.',
    feat_eyebrow: 'ماذا يقدم',
    feat_title: 'كل ما يحتاجه محرك المحتوى لديك.',
    feat_1_title: 'استوديو النصوص بالذكاء الاصطناعي',
    feat_1_text:
      'أنشئ عناوين جذابة ونصوصًا وحبكات قصصية ونسخًا بديلة لصنّاع المحتوى والوكالات وفرق المنتجات.',
    feat_2_title: 'تخطيط الفيديو',
    feat_2_text:
      'حوّل أي فكرة إلى مشاهد وقوائم لقطات وأوامر للقطات الداعمة وأنظمة نشر منظمة.',
    feat_3_title: 'التعليق الصوتي والسرد',
    feat_3_text:
      'حوّل النصوص إلى مسارات صوتية متقنة بإيقاع طبيعي ونبرة مناسبة.',
    feat_4_title: 'محرك العناوين والصور المصغّرة',
    feat_4_text:
      'أنشئ عناوين لافتة وأفكارًا للصور المصغّرة مصمّمة لزيادة نسبة النقر.',
    feat_5_title: 'سير عمل النشر',
    feat_5_text:
      'جدول المحتوى ووزّعه عبر القنوات دون فقدان الاتساق أو التركيز الاستراتيجي.',
    feat_6_title: 'التحليلات والتحسين',
    feat_6_text:
      'قِس ما يحقق أفضل أداء واحصل تلقائيًا على توصيات مبنية على بيانات محتواك.',
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
    dash_campaigns: '活动',
    dash_videos: '视频',
    dash_growth: '内容增长',
    dash_act1: '新一批脚本已生成',
    dash_act2: '发布工作流已优化',
    logos_label: '深受大规模产出内容的团队信赖',
    act_eyebrow: '看看实际效果',
    act_title: '让内容生产变得轻松。',
    act_badge: '营销活动仪表盘',
    act_auto: '自动脚本',
    act_live: '运行中',
    act_hook_title: '钩子与行动号召生成器',
    act_hook_text: '几秒钟内，把一个想法变成脚本大纲、故事线和有力的开场句。',
    tag_hook: '钩子',
    tag_scene: '场景',
    tag_cta: '行动号召',
    act_publishing: '发布',
    act_post_yt: '发布到 YouTube',
    act_shorts: '定时发布 Shorts',
    proof_eyebrow: '成果',
    proof_title: '流程清晰，团队成长更快。',
    proof_1_label: '发布速度平均提升',
    proof_1_detail: '团队无需增加人手，就能推出更多活动。',
    proof_2_label: '同一团队内容产出增加',
    proof_2_detail: 'AI 辅助的规划与内容复用让团队保持专注。',
    proof_3_label: '活动上线速度更快',
    proof_3_detail: '从简报到生产，一套流畅的系统搞定。',
    feat_eyebrow: '功能一览',
    feat_title: '内容引擎所需的一切。',
    feat_1_title: 'AI 脚本工坊',
    feat_1_text: '为创作者、营销机构和产品团队生成钩子、脚本、故事线和多种脚本版本。',
    feat_2_title: '视频策划',
    feat_2_text: '把任何创意变成场景、分镜清单、B-roll 提示词和结构化的发布体系。',
    feat_3_title: '配音与旁白',
    feat_3_text: '把脚本转换成节奏自然、语气贴合的高质量配音。',
    feat_4_title: '标题与缩略图引擎',
    feat_4_text: '创作吸睛的标题和缩略图创意，助力提升点击率。',
    feat_5_title: '发布工作流',
    feat_5_text: '跨渠道排期并分发内容，保持一致性和战略重点。',
    feat_6_title: '数据分析与优化',
    feat_6_text: '衡量最有效的内容，并根据你的内容数据自动给出下一步建议。',
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
