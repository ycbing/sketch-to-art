import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "tldraw/tldraw.css";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'SketchToArt — AI Sketch to Art Generator',
  description: 'Transform your sketches into stunning art with AI. 12 art styles, free canvas, instant generation.',
  openGraph: {
    title: 'SketchToArt — AI Sketch to Art Generator',
    description: 'Transform your sketches into stunning art with AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
            <Toaster position="top-center" richColors />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
