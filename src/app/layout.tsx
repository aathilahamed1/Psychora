
'use client'
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { I18nProvider, useI18n } from '@/contexts/i18n';
import { AuthProvider } from '@/contexts/auth';
import { AppContent } from '@/components/app-content';
import { ThemeProvider } from 'next-themes';
import { StaticBackground } from '@/components/static-background';
import { BotanicalBackground } from '@/components/botanical-background';
import { AnimatedBackground } from '@/components/animated-background';


// This metadata is not used as layout is a client component, but keeping it for reference
// export const metadata: Metadata = {
//   title: 'Psychora',
//   description: 'Your companion for mental wellness.',
// };

function AppBody({ children }: { children: React.ReactNode }) {
  const { language, direction } = useI18n();

  return (
    <html lang={language} dir={direction} suppressHydrationWarning>
      <head>
        <title>Psychora</title>
        <meta name="description" content="Your companion for mental wellness." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Hind+Vadodara:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
            <AuthProvider>
              <div className="relative min-h-screen w-full">
                <div className="fixed inset-0 -z-30">
                  <StaticBackground />
                </div>
                <div className="fixed inset-0 -z-20">
                  <BotanicalBackground />
                </div>
                <div className="fixed inset-0 -z-10">
                  <AnimatedBackground />
                </div>
                <AppContent>{children}</AppContent>
              </div>
            </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <I18nProvider>
        <AppBody>{children}</AppBody>
    </I18nProvider>
  );
}
