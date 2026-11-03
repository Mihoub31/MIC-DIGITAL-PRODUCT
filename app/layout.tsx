import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'CreatorPilot',
  description: 'Turn one idea into a full video and content machine.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
