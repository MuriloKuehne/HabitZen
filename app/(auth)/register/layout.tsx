import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a HabitZen account to start tracking your habits and earning XP",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

