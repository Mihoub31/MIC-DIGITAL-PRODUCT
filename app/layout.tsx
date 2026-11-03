import './globals.css';
import type { ReactNode } from 'react';
import { LanguageProvider } from './i18n';
import LanguageSwitcher from './LanguageSwitcher';

export const metadata = {
  title: 'CreatorPilot',
  description: 'Support FR, EN, ES, AR, ZH',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <LanguageSwitcher />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
