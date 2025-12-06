import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { ServiceWorkerRegistration } from "./components/ServiceWorkerRegistration";
import "./globals.css";

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "HabitZen - Gamified Habit Tracker",
    template: "%s - HabitZen",
  },
  description: "Track your daily and weekly habits with XP and leveling system. Build better habits, earn XP, and level up your life.",
  keywords: ["habit tracker", "gamification", "productivity", "habits", "XP", "leveling"],
  authors: [{ name: "HabitZen" }],
  creator: "HabitZen",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HabitZen",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HabitZen",
    title: "HabitZen - Gamified Habit Tracker",
    description: "Track your daily and weekly habits with XP and leveling system",
  },
  twitter: {
    card: "summary_large_image",
    title: "HabitZen - Gamified Habit Tracker",
    description: "Track your daily and weekly habits with XP and leveling system",
  },
  icons: {
    icon: [
      { url: "/icon-pwa.png", sizes: "any", type: "image/png" },
    ],
    apple: [
      { url: "/icon-pwa.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: [
      { url: "/icon-pwa.png", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
        <ServiceWorkerRegistration />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

