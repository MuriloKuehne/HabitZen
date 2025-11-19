import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "HabitZen - Gamified Habit Tracker",
    template: "%s - HabitZen",
  },
  description: "Track your daily and weekly habits with XP and leveling system",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

