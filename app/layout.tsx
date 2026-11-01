import './globals.css';

export const metadata = {
  title: 'CreatorPilot | AI Content Engine',
  description: 'CreatorPilot helps creators, agencies, and brands turn one idea into scripts, video plans, thumbnails, and publishing workflows.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
