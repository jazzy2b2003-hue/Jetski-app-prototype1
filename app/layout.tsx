import './globals.css';

export const metadata = {
  title: 'PWC Race Control',
  description: 'Jet ski race management, timing and rider communications',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
