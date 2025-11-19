"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth-actions";
import { LogOut, Home, BarChart3, Plus, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navLinks = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/stats",
      label: "Estatísticas",
      icon: BarChart3,
      active: pathname === "/dashboard/stats",
    },
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-30 backdrop-blur-sm bg-background/95">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold transition-opacity hover:opacity-80">
              HabitZen
            </Link>
            <nav className="hidden md:flex gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      link.active
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/dashboard/habits/new">
              <Button size="sm" variant="outline" className="hidden sm:flex transition-all duration-200 hover:scale-105">
                <Plus className="mr-2 h-4 w-4" />
                Novo Hábito
              </Button>
            </Link>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSignOut}
              className="transition-all duration-200 hover:scale-105"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Sair</span>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden transition-all duration-200 hover:scale-105"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent onClose={() => setMobileMenuOpen(false)}>
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                    link.active
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard/habits/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent mt-4"
            >
              <Plus className="h-5 w-5" />
              Novo Hábito
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent mt-4 text-left"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}

