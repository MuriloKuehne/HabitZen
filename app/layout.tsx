import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "next-themes";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.className}>
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

