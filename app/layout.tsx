import './globals.css';

export const metadata = {
  metadataBase: new URL('https://mic-digital-product.onrender.com'),
  title: 'CreatorPilot | AI Content Engine',
  description:
    'CreatorPilot helps creators, agencies, and brands turn one idea into scripts, video plans, thumbnails, and publishing workflows.',
  keywords: [
    'AI content engine',
    'creator tools',
    'video scripting',
    'content strategy',
    'marketing automation',
  ],
  openGraph: {
    title: 'CreatorPilot | AI Content Engine',
    description:
      'Turn one idea into a full content workflow with scripts, video plans, thumbnails, and publishing systems.',
    url: 'https://mic-digital-product.onrender.com',
    siteName: 'CreatorPilot',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
