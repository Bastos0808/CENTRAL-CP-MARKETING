import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import AuthGuard from '@/components/auth-guard';
import SmoothScroll from '@/components/smooth-scroll';

export const metadata: Metadata = {
  title: 'Briefing CP Marketing Digital',
  description: 'Formulário de briefing para projetos de marketing digital.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <SmoothScroll>
          <AuthGuard>
            {children}
          </AuthGuard>
        </SmoothScroll>
        <Toaster />
      </body>
    </html>
  );
}
